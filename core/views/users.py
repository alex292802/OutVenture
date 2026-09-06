from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from core.models import User
from core.serializers import UserSerializer


# TODO 1: Use this endpoint in AuthentificationContext to save user data and use it in form
# TODO 2: use this endpoint in register form to create an user
class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)  # FIXME: this will not work
