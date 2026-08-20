from django.urls import path
from rest_framework.routers import DefaultRouter

from apps.companies.views import CompanyApplyView, CompanyViewSet

router = DefaultRouter()
router.register("", CompanyViewSet, basename="company")

urlpatterns = [
    path("apply/", CompanyApplyView.as_view(), name="company-apply"),
    *router.urls,
]
