"""Candidate (worker) profiles and public-facing auth."""
from django.conf import settings
from django.db import models

from apps.core.models import TimeStampedModel, UUIDModel


class CandidateProfile(UUIDModel, TimeStampedModel):
    """Profile of a candidate taking interviews via public links."""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="candidate_profile",
    )
    phone_number = models.CharField(max_length=30, blank=True)
    github_url = models.URLField(blank=True)

    def __str__(self) -> str:
        return f"Candidate profile for {self.user.email}"
