from rest_framework.response import Response
from rest_framework.decorators import api_view


# TODO: serialize request and response
@api_view(["GET"])
def get_weather(request):
    request_data = request.data
    long = request_data.get("long", 0)
    lat = request_data.get("lat",0)
    # Get users preferences

    # Filter all sports from enum to keep only the ones that match user preferences
    # Récupérer la météo de la station la plus proche

    # Renvoyer la météo

    return Response(data={"temperature": 10, "humidity": 50, "wind": 10, "rain": 0})
