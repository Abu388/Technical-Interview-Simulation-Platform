from django.urls import path

from apps.candidates.views import CandidateRegistrationView

urlpatterns = [
    path("register/", CandidateRegistrationView.as_view(), name="candidate-register"),
]
