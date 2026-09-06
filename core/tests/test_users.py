import pytest
from django.db.utils import IntegrityError
from rest_framework import status
from rest_framework.test import APIClient

from core.models import User

UNAUTHENTICATED_STATUSES = (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN)

VALID_REGISTRATION_PAYLOAD = {
    "email": "hiker@example.com",
    "password": "Tr@ilM8ker2024",
    "public_name": "Hiker",
}


def create_user(email="alice@example.com", public_name="Alice", password="Tr@ilM8ker2024"):
    """Create and return a persisted user with a hashed password."""
    return User.objects.create_user(
        email=email, public_name=public_name, password=password
    )


@pytest.mark.django_db
def test_create_user_normalizes_email_casing_and_whitespace():
    """The email is trimmed and lower-cased so it stays a stable identifier."""
    user = create_user(email="  Hiker@Example.COM  ")

    assert user.email == "hiker@example.com"


@pytest.mark.django_db
def test_create_user_treats_email_as_case_insensitive_for_uniqueness():
    """Two casings of the same address must resolve to a single account."""
    create_user(email="hiker@example.com")

    with pytest.raises(IntegrityError):
        create_user(email="HIKER@EXAMPLE.COM")


@pytest.mark.django_db
def test_create_user_rejects_a_whitespace_only_email():
    """A blank email must be rejected instead of creating an account."""
    with pytest.raises(ValueError):
        create_user(email="   ")


@pytest.mark.django_db
def test_anonymous_user_can_register():
    """An anonymous request must be able to create a new account."""
    response = APIClient().post("/register/", VALID_REGISTRATION_PAYLOAD)

    assert response.status_code == status.HTTP_201_CREATED
    assert User.objects.filter(email="hiker@example.com").exists()


@pytest.mark.django_db
def test_registration_never_returns_the_password():
    """The registration response must not leak the password."""
    response = APIClient().post("/register/", VALID_REGISTRATION_PAYLOAD)

    assert "password" not in response.data


@pytest.mark.django_db
def test_registration_hashes_the_password():
    """The stored password must be hashed, never kept in clear text."""
    APIClient().post("/register/", VALID_REGISTRATION_PAYLOAD)

    user = User.objects.get(email="hiker@example.com")
    assert user.password != VALID_REGISTRATION_PAYLOAD["password"]
    assert user.check_password(VALID_REGISTRATION_PAYLOAD["password"])


@pytest.mark.django_db
def test_registration_requires_an_email():
    """Registration must reject a payload without an email."""
    payload = {key: value for key, value in VALID_REGISTRATION_PAYLOAD.items() if key != "email"}

    response = APIClient().post("/register/", payload)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert User.objects.count() == 0


@pytest.mark.django_db
def test_registration_rejects_a_duplicate_email():
    """The email uniquely identifies a user, so duplicates must be rejected."""
    create_user(email="hiker@example.com")

    response = APIClient().post("/register/", VALID_REGISTRATION_PAYLOAD)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert User.objects.filter(email="hiker@example.com").count() == 1


@pytest.mark.django_db
def test_registration_rejects_a_weak_password():
    """A password failing the configured validators must be rejected."""
    payload = {**VALID_REGISTRATION_PAYLOAD, "password": "12345"}

    response = APIClient().post("/register/", payload)

    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert not User.objects.filter(email="hiker@example.com").exists()


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
