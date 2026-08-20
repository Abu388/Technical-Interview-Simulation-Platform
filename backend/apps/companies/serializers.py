from rest_framework import serializers

from apps.companies.models import Company


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            "id",
            "name",
            "description",
            "website",
            "industry",
            "location",
            "company_size",
            "contact_email",
            "status",
            "is_active",
            "member_since",
            "created_at",
        ]
        read_only_fields = ["id", "status", "is_active", "member_since", "created_at"]


class CompanyRegistrationSerializer(serializers.ModelSerializer):
    about = serializers.CharField(source="description", required=True)
    industry = serializers.CharField(required=True)
    location = serializers.CharField(required=True)
    contact_email = serializers.EmailField(required=True)
    website = serializers.URLField(required=False, allow_blank=True)

    class Meta:
        model = Company
        fields = [
            "id",
            "name",
            "about",
            "website",
            "industry",
            "location",
            "contact_email",
            "status",
            "is_active",
            "member_since",
            "created_at",
        ]
        read_only_fields = ["id", "status", "is_active", "member_since", "created_at"]
