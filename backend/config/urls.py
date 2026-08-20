"""Root URL configuration."""
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/companies/", include("apps.companies.urls")),
    path("api/questions/", include("apps.questions.urls")),
    path("api/interviews/", include("apps.interviews.urls")),
]
