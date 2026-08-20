from rest_framework.routers import DefaultRouter

from apps.questions.views import CategoryViewSet, QuestionViewSet, TestCaseViewSet

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="category")
router.register("test-cases", TestCaseViewSet, basename="test-case")
router.register("", QuestionViewSet, basename="question")

urlpatterns = router.urls
