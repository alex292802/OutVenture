from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator

class Activity(models.Model):
    name = models.CharField(max_length=20, unique=True)

class GeoEntity(models.Model):
    longitude = models.FloatField(
        validators=[MinValueValidator(-180), MaxValueValidator(180)],
        blank=True,
        null=True
    )
    latitude = models.FloatField(
        validators=[MinValueValidator(-90), MaxValueValidator(90)],
        blank=True,
        null=True
        )
    activities = models.ManyToManyField(
        Activity,
        blank=True
    )

    class Meta:
        abstract = True

class User(AbstractUser, GeoEntity):
    friends = models.ManyToManyField(
        "self",
        blank=True
    )

class Spot(GeoEntity):
    name = models.CharField(max_length=100) # TODO: prevent user to input more characters than max_length   
    rating = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(5)])
    description = models.TextField()
    # TODO: add an optional start point and end point ?
