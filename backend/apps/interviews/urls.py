from rest_framework.routers import DefaultRouter

from apps.interviews.views import (
    BehavioralQuestionViewSet,
    CandidateSessionViewSet,
    InterviewLinkViewSet,
    InterviewViewSet,
)

router = DefaultRouter()
router.register("behavioral-questions", BehavioralQuestionViewSet, basename="behavioral-question")
router.register("links", InterviewLinkViewSet, basename="interview-link")
router.register("sessions", CandidateSessionViewSet, basename="candidate-session")
router.register("", InterviewViewSet, basename="interview")

urlpatterns = router.urls
