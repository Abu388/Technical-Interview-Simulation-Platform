"""Session management and shareable links."""
from django.db import models

from apps.companies.models import Company
from apps.core.models import TimeStampedModel, UUIDModel
from apps.core.utils import clean_code, new_uuid
from apps.questions.models import Question


class Interview(UUIDModel, TimeStampedModel):
    """A configured interview made of questions."""

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PAID = "paid", "Paid"
        GENERATED = "generated", "Generated"
        ACTIVE = "active", "Active"
        COMPLETED = "completed", "Completed"
        EXPIRED = "expired", "Expired"
        CANCELLED = "cancelled", "Cancelled"

    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="interviews")
    title = models.CharField(max_length=255)
    questions = models.ManyToManyField(Question, related_name="interviews", blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    expiration_date = models.DateTimeField(null=True, blank=True)
    allow_ai_behavioral_questions = models.BooleanField(default=True)

    class Meta:
        ordering = ["title"]

    def __str__(self) -> str:
        return self.title


class BehavioralQuestion(UUIDModel, TimeStampedModel):
    """Pre-recorded behavioral question appended to an interview."""

    interview = models.ForeignKey(
        Interview, on_delete=models.CASCADE, related_name="behavioral_questions"
    )
    text = models.TextField()
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self) -> str:
        return self.text[:60]


class InterviewLink(UUIDModel, TimeStampedModel):
    """A shareable link candidates use to start an interview."""

    interview = models.ForeignKey(
        Interview, on_delete=models.CASCADE, related_name="links"
    )
    code = models.CharField(max_length=32, unique=True, default=new_uuid)
    expires_at = models.DateTimeField(null=True, blank=True)
    max_attempts = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.code

    def save(self, *args, **kwargs):
        self.code = clean_code(self.code)
        super().save(*args, **kwargs)

    @property
    def url(self) -> str:
        return f"/interview/{self.code}"


class CandidateSession(UUIDModel, TimeStampedModel):
    """One candidate's attempt at an interview via a link."""

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        IN_PROGRESS = "in_progress", "In Progress"
        COMPLETED = "completed", "Completed"
        EXPIRED = "expired", "Expired"

    link = models.ForeignKey(InterviewLink, on_delete=models.CASCADE, related_name="sessions")
    candidate_name = models.CharField(max_length=255)
    candidate_email = models.EmailField()
    status = models.CharField(
        max_length=20, choices=Status.choices, default=Status.PENDING
    )
    score = models.FloatField(null=True, blank=True)
    recording_url = models.URLField(max_length=500, null=True, blank=True)
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.candidate_email} - {self.status}"


class CandidateAnswer(UUIDModel, TimeStampedModel):
    """A candidate's submitted code for one question in a session."""

    session = models.ForeignKey(
        CandidateSession, on_delete=models.CASCADE, related_name="answers"
    )
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    submitted_code = models.TextField(blank=True)
    language = models.CharField(max_length=50)

    class Meta:
        unique_together = ("session", "question")
        ordering = ["created_at"]

    def __str__(self) -> str:
        return f"Answer to {self.question.title} (session {self.session_id})"
