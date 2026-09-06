import requests
from rest_framework.generics import ListAPIView
from django.core.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from core.models import Activity, Spot, User
from core.secrets import GEOCODE_TOKEN
from core.serializers import ActivitySerializer, SpotSerializer, UserSerializer

class ActivityListView(ListAPIView):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]


# TODO 1: add custom methods to viewset (we should be able to retrieve only nearby spots/ the most populars/ the one liked by friends ...)
class SpotViewSet(ModelViewSet):
    queryset = Spot.objects.all()
    serializer_class = SpotSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=["get"], url_path="distance")
    def distance(self, request, pk):
        spot = Spot.objects.filter(id=pk)
        longitude = request["longitude"]
        latitude = request["latitude"]

        # FIXME: compute distance here
        return 0


# TODO 1: Use this endpoint in AuthentificationContext to save user data and use it in form 
# TODO 2: use this endpoint in register form to create an user
class UserViewSet(ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id) # FIXME: this will not work


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_weather(request):
    request_data = request.data
    longitude = request_data["longitude"]
    latitude = request_data.get["latitude"]  
    # TODO: Récupérer les PREVISIONS météos de la station la plus proche
    return Response(data={"temperature": 10, "humidity": 50, "wind": 10, "rain": 0})


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


