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
