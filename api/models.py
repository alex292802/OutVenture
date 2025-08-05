from django.db import models
from enum import Enum
from api.constants import Activities

class Activity(models.Model):
    name = models.CharField(max_length=20, choices=[(activity, activity.value) for activity in Activities])

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    activities = models.ManyToManyField(Activity)

class Spot(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    activities = models.ManyToManyField(Activity, on_delete=models.CASCADE)
    rating = models.IntegerField()
    description = models.CharField(max_length=1000)
    # TODO: add an optional start point and end point ?


    
