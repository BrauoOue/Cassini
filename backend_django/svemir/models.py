from django.contrib.gis.db import models as gis_models
from django.db import models
from rest_framework import serializers


# MODELS
class User(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)


class UserState(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    mood_level = models.IntegerField()
    stress_level = models.IntegerField()
    fatigue_level = models.IntegerField()
    focus_level = models.IntegerField()
    sleep_quality = models.IntegerField()
    heart_rate = models.IntegerField(null=True, blank=True)
    social_desire = models.IntegerField(null=True, blank=True)


class Location(models.Model):
    name = models.CharField(max_length=100)
    coordinates = gis_models.PointField()
    temperature = models.FloatField()
    humidity = models.FloatField()
    air_quality_index = models.FloatField()
    ndvi = models.FloatField()
    noise_level = models.FloatField()
    pressure = models.FloatField()
    proximity_to_water = models.FloatField()
    altitude = models.FloatField()
    health_index = models.FloatField(null=True, blank=True)


class Visit(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    mood_improvement = models.IntegerField(null=True, blank=True)
    stress_reduction = models.IntegerField(null=True, blank=True)
    fatigue_reduction = models.IntegerField(null=True, blank=True)
    comment = models.TextField(null=True, blank=True)


# SERIALIZERS
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class UserStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserState
        fields = '__all__'


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'


class VisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visit
        fields = ['user', 'location']


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visit
        fields = ['mood_improvement', 'stress_reduction', 'fatigue_reduction', 'comment']
