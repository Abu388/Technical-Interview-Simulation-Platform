from rest_framework import serializers

from apps.questions.models import Category, CodeTemplate, Question, TestCase


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "company", "is_global", "name", "description", "created_at"]
        read_only_fields = ["id", "created_at"]


class CodeTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CodeTemplate
        fields = ["id", "question", "language", "starter_code", "created_at"]
        read_only_fields = ["id", "created_at"]


class QuestionSerializer(serializers.ModelSerializer):
    code_templates = CodeTemplateSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = [
            "id",
            "company",
            "category",
            "is_global",
            "title",
            "prompt",
            "constraints",
            "difficulty",
            "time_limit_seconds",
            "is_active",
            "code_templates",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class TestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = ["id", "question", "input_data", "expected_output", "is_hidden", "weight"]
        read_only_fields = ["id"]