from rest_framework import serializers

from core.models import Activity, Spot
from core.serializers.users import ReviewSerializer


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ["id", "name"]


# TODO: add a global score, based on reviews (average)
class SpotSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Spot
        fields = ["id", "name", "longitude", "latitude", "activities", "reviews"]
