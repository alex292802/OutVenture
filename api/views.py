import requests

from django.core.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# TODO: manage with env variable
TOKEN = "523065778120261600498x52178 "

# TODO: serialize request and response
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_weather(request):
    request_data = request.data
    long = request_data.get("long", 0)
    lat = request_data.get("lat",0)
    # Get users preferences

    # Filter all sports from enum to keep only the ones that match user preferences
    # Récupérer la météo de la station la plus proche

    # Renvoyer la météo

    return Response(data={"temperature": 10, "humidity": 50, "wind": 10, "rain": 0})


# TODO: serialize request and response
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def validate_city(request):
    city = request.GET.get('city')

    geocode_request = requests.get(f'https://geocode.xyz/{city}?json=1&auth={TOKEN}')

    if geocode_request.status_code == 200:
        city_details = geocode_request.json()["standard"]
        postal = geocode_request.json()["alt"]["loc"][0]["postal"]
        return Response(data={"validated_city": f"{city_details.get('city', '')} ({postal}) {city_details.get('prov', '')}"})
    else:
        raise ValidationError()


