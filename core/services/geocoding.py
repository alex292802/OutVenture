import requests
from django.conf import settings


class GeocodingError(Exception):
    """Raised when the geocoding provider cannot resolve a location."""


def resolve_city_location(city: str) -> dict:
    """Resolve a French city name into structured location data.

    Queries the geocode.xyz provider and extracts its best-match location.

    :param city: The city name to geocode.
    :return: Mapping with city, postal, country, longitude and latitude.
    :raises GeocodingError: When the provider fails or returns no usable match.
    """
    response = requests.get(
        f"https://geocode.xyz/{city}+France",
        params={"json": 1, "auth": settings.GEOCODE_TOKEN},
    )
    if response.status_code != requests.codes.ok:
        raise GeocodingError(
            f"Geocoding provider returned status {response.status_code}."
        )
    try:
        location = response.json()["alt"]["loc"]
        return {
            "city": location["city"],
            "postal": location["postal"],
            "country": location["prov"],
            "longitude": location["longt"],
            "latitude": location["latt"],
        }
    except (KeyError, ValueError) as error:
        raise GeocodingError("Geocoding response had an unexpected shape.") from error
