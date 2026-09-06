from django.contrib.auth.models import BaseUserManager


class UserManager(BaseUserManager):
    """
    Manager for the email-based User model.

    Replaces Django's default ``UserManager`` so that users are created and
    identified by their email address instead of a username.
    """

    use_in_migrations = True

    def create_user(
        self, email: str, password: str | None = None, **extra_fields
    ):
        email = self.normalize_email((email or "").strip()).lower()
        if not email:
            raise ValueError("Users must have an email address.")
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(
        self, email: str, password: str | None = None, **extra_fields
    ):
        extra_fields["is_staff"] = True
        extra_fields["is_superuser"] = True
        return self.create_user(email, password, **extra_fields)
