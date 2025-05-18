from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    Location, LocationCharacteristics, UserState, 
    LocationSelection, SuggestedLocation, LocationFeedback, UserVisit, UserFeedback
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class UserStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserState
        fields = ['id', 'timestamp', 'mental_state', 'physical_state']

class LocationCharacteristicsSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationCharacteristics
        exclude = ['id', 'location']

class LocationSerializer(serializers.ModelSerializer):
    characteristics = LocationCharacteristicsSerializer(many=True, read_only=True)
    
    class Meta:
        model = Location
        fields = ['id', 'name', 'latitude', 'longitude', 'characteristics']

class SuggestedLocationSerializer(serializers.ModelSerializer):
    location = LocationSerializer()
    
    class Meta:
        model = SuggestedLocation
        fields = ['location', 'similarity_score', 'health_index_score', 'combined_score', 'rank']

class LocationSelectionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    user_state = UserStateSerializer(read_only=True)
    location = LocationSerializer(read_only=True)
    other_suggestions = SuggestedLocationSerializer(
        source='suggestedlocation_set',
        many=True,
        read_only=True
    )
    
    class Meta:
        model = LocationSelection
        fields = [
            'id', 'user', 'user_state', 'location', 'timestamp',
            'current_location_lat', 'current_location_lon',
            'search_radius_km', 'other_suggestions'
        ]

class LocationFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = LocationFeedback
        fields = '__all__'

# Input serializers for API endpoints
class UserStateInputSerializer(serializers.Serializer):
    # Mental state metrics (0-10 scale)
    stress_level = serializers.FloatField(min_value=0, max_value=10)
    anxiety_level = serializers.FloatField(min_value=0, max_value=10)
    mood = serializers.FloatField(min_value=0, max_value=10)
    sleep_quality = serializers.FloatField(min_value=0, max_value=10)
    energy_level = serializers.FloatField(min_value=0, max_value=10)
    focus_level = serializers.FloatField(min_value=0, max_value=10)
    motivation = serializers.FloatField(min_value=0, max_value=10)
    
    # Physical state metrics (optional)
    heart_rate = serializers.FloatField(required=False, allow_null=True)
    blood_pressure_systolic = serializers.FloatField(required=False, allow_null=True)
    blood_pressure_diastolic = serializers.FloatField(required=False, allow_null=True)
    body_temperature = serializers.FloatField(required=False, allow_null=True)
    respiratory_rate = serializers.FloatField(required=False, allow_null=True)
    physical_activity_level = serializers.FloatField(min_value=0, max_value=10)
    pain_level = serializers.FloatField(min_value=0, max_value=10)
    
    # Location context (optional)
    current_latitude = serializers.FloatField(required=False, allow_null=True)
    current_longitude = serializers.FloatField(required=False, allow_null=True)
    search_radius_km = serializers.FloatField(required=False, default=20.0)

class LocationFeedbackInputSerializer(serializers.Serializer):
    # Required fields
    mood_impact = serializers.IntegerField(min_value=-5, max_value=5)
    stress_impact = serializers.IntegerField(min_value=-5, max_value=5)
    energy_impact = serializers.IntegerField(min_value=-5, max_value=5)
    overall_satisfaction = serializers.IntegerField(min_value=-5, max_value=5)
    
    # Optional fields
    visit_duration_minutes = serializers.IntegerField(required=False, allow_null=True)
    activities_performed = serializers.JSONField(required=False)
    comments = serializers.CharField(required=False, allow_blank=True)
    crowding_level = serializers.IntegerField(
        required=False,
        min_value=0,
        max_value=10,
        allow_null=True
    )

class SimilarLocationSerializer(serializers.Serializer):
    name = serializers.CharField()
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    distance_km = serializers.FloatField()
    similarity_score = serializers.FloatField()
    characteristics = serializers.DictField(child=serializers.FloatField())

class LocationPredictionSerializer(serializers.Serializer):
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    confidence = serializers.FloatField()
    characteristics = serializers.DictField(child=serializers.FloatField())
    improvement_score = serializers.FloatField()
    location_name = serializers.CharField(required=False, allow_null=True)
    distance_km = serializers.FloatField(required=False, allow_null=True)
    similar_locations = SimilarLocationSerializer(many=True, required=False)

class UserFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFeedback
        fields = [
            'id', 'visit', 'timestamp', 'mood_improvement',
            'stress_reduction', 'energy_change',
            'overall_satisfaction', 'comments'
        ]

class UserVisitSerializer(serializers.ModelSerializer):
    user_state = UserStateSerializer(read_only=True)
    feedback = UserFeedbackSerializer(read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)

    class Meta:
        model = UserVisit
        fields = [
            'id', 'user', 'location', 'location_name',
            'timestamp', 'duration', 'user_state', 'feedback'
        ]
        read_only_fields = ['user', 'duration'] 