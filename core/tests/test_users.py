import pytest
from rest_framework import status
from rest_framework.test import APIClient

from core.models import User

UNAUTHENTICATED_STATUSES = (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN)

VALID_REGISTRATION_PAYLOAD = {
    "username": "newhiker",
    "password": "Tr@ilM8ker2024",
    "public_name": "Hiker",
}


def create_user(username="alice", public_name="Alice", password="Tr@ilM8ker2024"):
    """Create and return a persisted user with a hashed password."""
    return User.objects.create_user(
        username=username, public_name=public_name, password=password
    )


@pytest.mark.django_db
def test_anonymous_user_can_register():
    """An anonymous request must be able to create a new account."""
    response = APIClient().post("/register/", VALID_REGISTRATION_PAYLOAD)

    assert response.status_code == status.HTTP_201_CREATED
    assert User.objects.filter(username="newhiker").exists()


@pytest.mark.django_db
def test_registration_never_returns_the_password():
    """The registration response must not leak the password."""
    response = APIClient().post("/register/", VALID_REGISTRATION_PAYLOAD)

    assert "password" not in response.data


@pytest.mark.django_db
def test_registration_hashes_the_password():
    """The stored password must be hashed, never kept in clear text."""
    APIClient().post("/register/", VALID_REGISTRATION_PAYLOAD)

    user = User.objects.get(username="newhiker")
    assert user.password != VALID_REGISTRATION_PAYLOAD["password"]
    assert user.check_password(VALID_REGISTRATION_PAYLOAD["password"])


@pytest.mark.django_db
def test_registration_rejects_a_weak_password():
    """A password failing the configured validators must be rejected."""
    payload = {**VALID_REGISTRATION_PAYLOAD, "password": "12345"}

    response = APIClient().post("/register/", payload)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert not User.objects.filter(username="newhiker").exists()


@pytest.mark.django_db
def test_current_user_endpoint_rejects_anonymous_request():
    """The self-profile endpoint must require authentication."""
    response = APIClient().get("/current-user/")

    assert response.status_code in UNAUTHENTICATED_STATUSES


@pytest.mark.django_db
def test_current_user_endpoint_returns_the_authenticated_user_profile():
    """An authenticated request must receive its own profile."""
    user = create_user()
    client = APIClient()
    client.force_authenticate(user=user)

    response = client.get("/current-user/")

    assert response.status_code == status.HTTP_200_OK
    assert response.data["id"] == user.id
    assert response.data["public_name"] == user.public_name


@pytest.mark.django_db
def test_current_user_endpoint_updates_the_authenticated_user_profile():
    """An authenticated request must be able to update its own profile."""
    user = create_user()
    client = APIClient()
    client.force_authenticate(user=user)

    response = client.patch("/current-user/", {"public_name": "Updated"})

    assert response.status_code == status.HTTP_200_OK
    user.refresh_from_db()
    assert user.public_name == "Updated"
