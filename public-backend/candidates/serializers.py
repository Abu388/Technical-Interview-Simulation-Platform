from django.contrib.auth import get_user_model
from rest_framework import serializers

from apps.candidates.models import CandidateProfile

User = get_user_model()


class CandidateRegistrationSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        email = value.strip().lower()
        if User.objects.filter(email__iexact=email).exists() or User.objects.filter(
            username=email
        ).exists():
            raise serializers.ValidationError("A user with this email is already registered.")
        return email

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )
        CandidateProfile.objects.create(user=user)
        return user
