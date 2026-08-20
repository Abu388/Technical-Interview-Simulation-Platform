from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from django.utils import timezone

from apps.companies.models import Company
from apps.interviews.models import (
    BehavioralQuestion,
    CandidateAnswer,
    CandidateSession,
    Interview,
    InterviewLink,
)
from apps.interviews.serializers import (
    BehavioralQuestionSerializer,
    CandidateAnswerSerializer,
    CandidateQuestionSerializer,
    CandidateSessionSerializer,
    InterviewLinkSerializer,
    InterviewSerializer,
)


class InterviewViewSet(viewsets.ModelViewSet):
    queryset = Interview.objects.prefetch_related("questions").all()
    serializer_class = InterviewSerializer
    permission_classes = [permissions.IsAuthenticated]


class BehavioralQuestionViewSet(viewsets.ModelViewSet):
    queryset = BehavioralQuestion.objects.all()
    serializer_class = BehavioralQuestionSerializer
    permission_classes = [permissions.IsAuthenticated]


class InterviewLinkViewSet(viewsets.ModelViewSet):
    queryset = InterviewLink.objects.all()
    serializer_class = InterviewLinkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def _get_valid_link(self, code):
        try:
            link = InterviewLink.objects.select_related("interview__company").get(
                code__iexact=code
            )
        except InterviewLink.DoesNotExist:
            raise NotFound("Invalid interview link.")
        if link.expires_at and link.expires_at < timezone.now():
            raise NotFound("This interview link has expired.")
        return link

    @action(
        detail=False,
        methods=["get"],
        permission_classes=[permissions.AllowAny],
        url_path="validate/(?P<code>[^/.]+)",
    )
    def validate(self, request, code=None):
        link = self._get_valid_link(code)
        return Response(
            {
                "company_name": link.interview.company.name,
                "interview_title": link.interview.title,
                "expires_at": link.expires_at,
            }
        )

    @action(
        detail=False,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
        url_path="start/(?P<code>[^/.]+)",
    )
    def start(self, request, code=None):
        link = self._get_valid_link(code)
        email = request.user.email
        session = CandidateSession.objects.filter(
            link=link, candidate_email=email
        ).first()
        if session is None:
            session = CandidateSession.objects.create(
                link=link,
                candidate_name=request.user.get_full_name() or request.user.username,
                candidate_email=email,
                status=CandidateSession.Status.IN_PROGRESS,
                started_at=timezone.now(),
            )
        else:
            session.status = CandidateSession.Status.IN_PROGRESS
            session.started_at = timezone.now()
            session.save()
        questions = CandidateQuestionSerializer(
            link.interview.questions.all(), many=True
        ).data
        return Response(
            {"session_id": str(session.id), "questions": questions},
            status=status.HTTP_201_CREATED,
        )


class CandidateSessionViewSet(viewsets.ModelViewSet):
    queryset = CandidateSession.objects.select_related("link__interview__company").all()
    serializer_class = CandidateSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = self.queryset
        user = self.request.user
        if user.is_staff:
            return queryset
        if Company.objects.filter(owner=user).exists():
            return queryset.filter(link__interview__company__owner=user)
        return queryset.filter(candidate_email=user.email)

    @action(
        detail=True,
        methods=["post"],
        permission_classes=[permissions.IsAuthenticated],
        url_path="submit",
    )
    def submit(self, request, pk=None):
        session = self.get_object()
        if session.candidate_email != request.user.email:
            return Response(
                {"detail": "You are not authorized to submit this session."},
                status=status.HTTP_403_FORBIDDEN,
            )
        for item in request.data.get("answers", []):
            payload = {
                "session": session.id,
                "question": item.get("question_id"),
                "submitted_code": item.get("submitted_code", ""),
                "language": item.get("language", ""),
            }
            serializer = CandidateAnswerSerializer(data=payload)
            serializer.is_valid(raise_exception=True)
            CandidateAnswer.objects.update_or_create(
                session=session,
                question_id=item["question_id"],
                defaults={
                    "submitted_code": item.get("submitted_code", ""),
                    "language": item.get("language", ""),
                },
            )
        session.recording_url = request.data.get("recording_url")
        session.status = CandidateSession.Status.COMPLETED
        session.completed_at = timezone.now()
        session.save()
        return Response(
            {"message": "Interview submitted successfully."},
            status=status.HTTP_200_OK,
        )
