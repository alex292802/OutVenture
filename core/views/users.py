from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated

from core.serializers import RegisterUserSerializer, UserSerializer


class RegisterView(CreateAPIView):
    """Create a new user account from an anonymous request."""

    serializer_class = RegisterUserSerializer
    permission_classes = [AllowAny]


class CurrentUserView(RetrieveUpdateAPIView):
    """Read and update the currently authenticated user's own profile."""

    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
