"""Non-regression tests for the API's secure-by-default permission policy.

These tests guard the DRF `DEFAULT_PERMISSION_CLASSES` setting: any endpoint
must reject unauthenticated access unless a view explicitly opts out. This
prevents a future view that forgets `permission_classes` from being exposed
publicly.
"""

import pytest
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.settings import api_settings
from rest_framework.test import APIClient

UNAUTHENTICATED_STATUSES = (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN)


def test_default_permission_is_authenticated():
    """The global DRF default must require authentication.

    Guards the secure-by-default posture: a view that omits
    `permission_classes` inherits `IsAuthenticated` rather than `AllowAny`.
    """
    assert IsAuthenticated in api_settings.DEFAULT_PERMISSION_CLASSES


@pytest.mark.django_db
def test_activities_endpoint_rejects_anonymous_request():
    """An anonymous request to a protected endpoint must be denied."""
    response = APIClient().get("/activities/")

    assert response.status_code in UNAUTHENTICATED_STATUSES
