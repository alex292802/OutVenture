from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from core.services.geocoding import GeocodingError, resolve_city_location


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_weather(request):
    request_data = request.data
    longitude = request_data["longitude"]
    latitude = request_data["latitude"]
    # TODO: Récupérer les PREVISIONS météos de la station la plus proche
    return Response(data={"temperature": 10, "humidity": 50, "wind": 10, "rain": 0})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def validate_city(request):
    city = request.GET.get("city")
    try:
        location = resolve_city_location(city)
    except GeocodingError:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    return Response(data=location)
