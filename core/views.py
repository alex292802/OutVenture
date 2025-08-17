import requests
from rest_framework.generics import ListAPIView
from django.core.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from core.models import Activity
from core.secrets import GEOCODE_TOKEN
from core.serializers import ActivitySerializer

class ActivityListView(ListAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]


# TODO: serialize request and response
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_weather(request):
    request_data = request.data
    longitude = request_data["longitude"]
    latitude = request_data.get["latitude"]  
    # TODO: Récupérer les PREVISIONS météos de la station la plus proche
    return Response(data={"temperature": 10, "humidity": 50, "wind": 10, "rain": 0})


# TODO: serialize request and response
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def validate_city(request):
    city = request.GET.get('city')
    geocode_resp = requests.get(f'https://geocode.xyz/{city}+France?json=1&auth={GEOCODE_TOKEN}')
    if geocode_resp.status_code == 200:
        resp_dict = geocode_resp.json()["alt"]["loc"]
        return Response(
            data={
                "city": resp_dict['city'],
                "postal": resp_dict['postal'],
                "country": resp_dict['prov'],
                "longitude": resp_dict["longt"],
                "latitude": resp_dict["latt"],
            }
        )
    else:
        raise ValidationError()


