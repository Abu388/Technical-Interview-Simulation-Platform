from rest_framework import permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.companies.models import Company
from apps.companies.serializers import CompanyRegistrationSerializer, CompanySerializer


class CompanyApplyView(APIView):
    """Public endpoint for companies to apply for registration."""

    permission_classes = [permissions.AllowAny]
    serializer_class = CompanyRegistrationSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(status=Company.Status.PENDING, is_active=False)
        return Response(
            {
                "message": "Application submitted successfully and is pending admin approval.",
                "company": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return self.queryset
        return self.queryset.filter(
            status=Company.Status.APPROVED, is_active=True, owner=self.request.user
        )
