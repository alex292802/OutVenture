from rest_framework import status
from rest_framework.decorators import action
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from core.helpers import compute_distance
from core.models import Activity, Spot
from core.serializers import ActivitySerializer, SpotSerializer


class ActivityListView(ListAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]


# TODO 1: add custom methods to viewset (we should be able to retrieve only nearby spots/ the most populars/ the one liked by friends ...)
# TODO 2: add view serializer
class SpotViewSet(ModelViewSet):
    queryset = Spot.objects.all()
    serializer_class = SpotSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=["get"], url_path="distance")
    def distance(self, request, pk=None):
        spot = self.get_object()
        longitude = request.query_params["longitude"]
        latitude = request.query_params["latitude"]

        distance_km = compute_distance(
            spot.latitude, spot.longitude, latitude, longitude
        )
        return Response(data={"distance_km": distance_km})
