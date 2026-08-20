from rest_framework import serializers

from apps.interviews.models import (
    BehavioralQuestion,
    CandidateAnswer,
    CandidateSession,
    Interview,
    InterviewLink,
)
from apps.questions.models import Question
from apps.questions.serializers import CodeTemplateSerializer, TestCaseSerializer


class InterviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interview
        fields = [
            "id",
            "company",
            "title",
            "questions",
            "status",
            "expiration_date",
            "allow_ai_behavioral_questions",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class BehavioralQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BehavioralQuestion
        fields = ["id", "interview", "text", "order"]
        read_only_fields = ["id"]


class InterviewLinkSerializer(serializers.ModelSerializer):
    url = serializers.CharField(source="url", read_only=True)

    class Meta:
        model = InterviewLink
        fields = ["id", "interview", "code", "url", "expires_at", "max_attempts", "created_at"]
        read_only_fields = ["id", "code", "url", "created_at"]


class CandidateAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateAnswer
        fields = ["id", "session", "question", "submitted_code", "language", "created_at"]
        read_only_fields = ["id", "created_at"]


class CandidateSessionSerializer(serializers.ModelSerializer):
    answers = CandidateAnswerSerializer(many=True, read_only=True)
    duration = serializers.SerializerMethodField()
    interview_title = serializers.SerializerMethodField()

    class Meta:
        model = CandidateSession
        fields = [
            "id",
            "link",
            "candidate_name",
            "candidate_email",
            "status",
            "score",
            "recording_url",
            "answers",
            "duration",
            "interview_title",
            "started_at",
            "completed_at",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_duration(self, obj):
        if (
            obj.status != CandidateSession.Status.COMPLETED
            or not obj.completed_at
            or not obj.started_at
        ):
            return None
        total = int((obj.completed_at - obj.started_at).total_seconds())
        hours, remainder = divmod(total, 3600)
        minutes, seconds = divmod(remainder, 60)
        parts = []
        if hours:
            parts.append(f"{hours}h")
        if minutes:
            parts.append(f"{minutes}m")
        parts.append(f"{seconds}s")
        return " ".join(parts)

    def get_interview_title(self, obj):
        return obj.link.interview.title


class CandidateQuestionSerializer(serializers.ModelSerializer):
    """Question payload for the candidate IDE: starter code + visible test cases only."""

    code_templates = CodeTemplateSerializer(many=True, read_only=True)
    test_cases = serializers.SerializerMethodField()

    class Meta:
        model = Question
        fields = [
            "id",
            "title",
            "prompt",
            "constraints",
            "difficulty",
            "time_limit_seconds",
            "code_templates",
            "test_cases",
        ]

    def get_test_cases(self, obj):
        visible = obj.test_cases.filter(is_hidden=False)
        return TestCaseSerializer(visible, many=True).data
