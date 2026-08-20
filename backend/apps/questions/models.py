"""The scalable question engine."""
from django.db import models

from apps.companies.models import Company
from apps.core.models import TimeStampedModel, UUIDModel


class Category(UUIDModel, TimeStampedModel):
    """Groups questions by topic (e.g. Python, System Design)."""

    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, null=True, blank=True, related_name="categories"
    )
    is_global = models.BooleanField(default=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "categories"
        ordering = ["name"]
        constraints = [
            models.UniqueConstraint(
                fields=["name", "company"],
                condition=models.Q(company__isnull=False),
                name="unique_category_per_company",
            )
        ]

    def __str__(self) -> str:
        return self.name


class Question(UUIDModel, TimeStampedModel):
    """A single interview question with grading context."""

    class Difficulty(models.TextChoices):
        EASY = "easy", "Easy"
        MEDIUM = "medium", "Medium"
        HARD = "hard", "Hard"

    DIFFICULTY_TIME_LIMITS = {
        Difficulty.EASY: 15 * 60,
        Difficulty.MEDIUM: 30 * 60,
        Difficulty.HARD: 45 * 60,
    }

    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, null=True, blank=True, related_name="questions"
    )
    is_global = models.BooleanField(default=False)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="questions"
    )
    title = models.CharField(max_length=255)
    prompt = models.TextField()
    constraints = models.TextField(blank=True)
    difficulty = models.CharField(max_length=10, choices=Difficulty.choices, default=Difficulty.MEDIUM)
    time_limit_seconds = models.PositiveIntegerField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["category", "title"]

    def __str__(self) -> str:
        return self.title

    def save(self, *args, **kwargs):
        if self.time_limit_seconds is None:
            self.time_limit_seconds = self.DIFFICULTY_TIME_LIMITS.get(
                self.difficulty, self.DIFFICULTY_TIME_LIMITS[self.Difficulty.MEDIUM]
            )
        super().save(*args, **kwargs)


class TestCase(UUIDModel, TimeStampedModel):
    """Expected output used to score a candidate's answer."""

    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name="test_cases")
    input_data = models.TextField(blank=True)
    expected_output = models.TextField()
    is_hidden = models.BooleanField(default=False)
    weight = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ["weight"]

    def __str__(self) -> str:
        return f"TestCase for {self.question.title}"


class CodeTemplate(UUIDModel, TimeStampedModel):
    """Starter code for a question in a given programming language."""

    class Language(models.TextChoices):
        PYTHON = "python", "Python"
        JAVA = "java", "Java"
        CPP = "cpp", "C++"
        JAVASCRIPT = "javascript", "JavaScript"

    question = models.ForeignKey(
        Question, on_delete=models.CASCADE, related_name="code_templates"
    )
    language = models.CharField(max_length=20, choices=Language.choices)
    starter_code = models.TextField()

    class Meta:
        unique_together = ("question", "language")
        ordering = ["language"]

    def __str__(self) -> str:
        return f"{self.language} template for {self.question.title}"
