from rest_framework import serializers

from core.models import Activity, Spot, User, Review


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ["id", "name"]

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "public_name",
        ]

class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = Review
        fields = ["date", "rating", "comment", "user"]

# TODO: add a global score, based on reviews (average)
class SpotSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)
    class Meta:
        model = Spot
        fields = ["id", "name", "longitude", "latitude", "activities", "reviews"]


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "public_name",
            "longitude",
            "latitude",
            "activities"
        ]
