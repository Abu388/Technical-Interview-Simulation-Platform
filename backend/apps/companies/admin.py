from django.contrib import admin
from django.contrib.auth import get_user_model
from django.utils import timezone

from apps.companies.models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "contact_email",
        "industry",
        "status",
        "is_active",
        "created_at",
        "member_since",
    ]
    list_filter = ["status", "is_active", "industry"]
    search_fields = ["name", "contact_email", "industry"]
    actions = ["approve_companies", "reject_companies"]

    @admin.action(description="Approve Selected Companies")
    def approve_companies(self, request, queryset):
        User = get_user_model()
        approved = 0
        for company in queryset:
            if not company.owner:
                user = User.objects.filter(email__iexact=company.contact_email).first()
                if user is None:
                    user = User.objects.create_user(
                        username=company.contact_email,
                        email=company.contact_email,
                        password=None,
                    )
                company.owner = user
            company.status = Company.Status.APPROVED
            company.is_active = True
            company.member_since = timezone.now()
            company.save()
            approved += 1
        self.message_user(
            request, f"{approved} company(ies) approved successfully."
        )

    @admin.action(description="Reject Selected Companies")
    def reject_companies(self, request, queryset):
        rejected = queryset.update(
            status=Company.Status.REJECTED,
            is_active=False,
            member_since=None,
        )
        self.message_user(request, f"{rejected} company(ies) rejected.", level="INFO")
