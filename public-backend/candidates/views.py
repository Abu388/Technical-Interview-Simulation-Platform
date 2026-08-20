from rest_framework import permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.candidates.serializers import CandidateRegistrationSerializer


class CandidateRegistrationView(APIView):
    """Public endpoint for candidates to create an account."""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CandidateRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {
                "token": token.key,
                "user": {
                    "id": user.id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                },
            },
            status=status.HTTP_201_CREATED,
        )
