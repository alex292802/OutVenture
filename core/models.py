from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator


class Activity(models.Model):
    name = models.CharField(max_length=20, unique=True)


class GeoEntity(models.Model):
    longitude = models.FloatField(
        validators=[MinValueValidator(-180), MaxValueValidator(180)],
        blank=True,
        null=True,
    )
    latitude = models.FloatField(
        validators=[MinValueValidator(-90), MaxValueValidator(90)],
        blank=True,
        null=True,
    )
    activities = models.ManyToManyField(Activity, blank=True)

    class Meta:
        abstract = True


class User(AbstractUser, GeoEntity):
    # TODO: prevent user to input more characters than max_length. This can be handled by an error custom sent by the
    #  "create function" of User and then shown in frontend ?
    public_name = models.CharField(max_length=20)
    friends = models.ManyToManyField("self", blank=True)
    # TODO: add constraint public_name != user_name ?


class Review(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(
        auto_now=True
    )  # auto_now adds automatically the actual date when saving
    rating = models.SmallIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    comment = models.TextField(
        max_length=1000, blank=True, null=True
    )  # TODO: prevent user to input more characters than max_length.


class Spot(GeoEntity):
    name = models.CharField(
        max_length=100
    )  # TODO: prevent user to input more characters than max_length
    reviews = models.ManyToManyField(Review)
    # TODO: add an optional start point and end point ? En effet on a un problème pour les activités type course à pied/ vélo. Il faudrait avoir du routage
