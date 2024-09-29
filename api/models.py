from django.db import models
from enum import Enum

# TODO: move enums to a separate file
class SportEnum(Enum):
    SURF = 'Surf'
    CLIMBING = 'Climbing'
    SWIMMING = 'Swimming'
    RUNNING = 'Running'

class Sport(models.Model):
    name = models.CharField(max_length=20, choices=[(sport, sport.value) for sport in SportEnum])

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=100)
    sports = models.ManyToManyField(Sport)

class Spot(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100) # TODO: this should be start point and end point (optional for surf and climbing)
    sports = models.ForeignKey(Sport, on_delete=models.CASCADE)
    user_notation = models.IntegerField()
    user_comments = models.ListField(child = models.CharField(max_length=100))
    difficulty = models.IntegerField() # 1 to 5


    
