from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from core.models import Review, User


class PublicUserSerializer(serializers.ModelSerializer):
    """Minimal, publicly shareable representation of a user.

    Exposes only non-sensitive identity fields, so it can be embedded in
    other payloads (e.g. review authors) without leaking location data.
    """

    class Meta:
        model = User
        fields = ["id", "public_name"]


class ReviewSerializer(serializers.ModelSerializer):
    user = PublicUserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ["date", "rating", "comment", "user"]


class UserSerializer(serializers.ModelSerializer):
    """Full representation of a user, including their own geolocation data."""

    class Meta:
        model = User
        fields = [
            "id",
            "public_name",
            "longitude",
            "latitude",
            "activities",
        ]


class RegisterUserSerializer(serializers.ModelSerializer):
    """Input serializer for anonymous user registration"""

    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ["id", "username", "password", "public_name"]
        read_only_fields = ["id"]

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)
