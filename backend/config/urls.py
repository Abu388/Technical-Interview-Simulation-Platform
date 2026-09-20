"""Root URL configuration."""
from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token

def api_root(request):
    return JsonResponse({
        "service": "HirePath API",
        "status": "ok",
        "api": "/api/",
        "admin": "/admin/",
    })


urlpatterns = [
    path("", api_root, name="api-root"),
    path("admin/", admin.site.urls),
    path("api/auth/token/", obtain_auth_token, name="api-token"),
    path("api/companies/", include("apps.companies.urls")),
    path("api/questions/", include("apps.questions.urls")),
    path("api/interviews/", include("apps.interviews.urls")),
]
