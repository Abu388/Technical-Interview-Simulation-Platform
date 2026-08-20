from rest_framework import permissions, viewsets

from apps.questions.models import Category, Question, TestCase
from apps.questions.serializers import CategorySerializer, QuestionSerializer, TestCaseSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.select_related("category", "company").all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]


class TestCaseViewSet(viewsets.ModelViewSet):
    queryset = TestCase.objects.select_related("question").all()
    serializer_class = TestCaseSerializer
    permission_classes = [permissions.IsAuthenticated]
