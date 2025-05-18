from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

# Create your models here.

class UserProfile(models.Model):
    """Extended user profile with demographic and preference data"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    age_group = models.CharField(max_length=20, choices=[
        ('18-25', '18-25'),
        ('26-35', '26-35'),
        ('36-45', '36-45'),
        ('46-55', '46-55'),
        ('56+', '56+')
    ])
    chronic_conditions = models.JSONField(default=list, blank=True)
    weather_preference = models.CharField(max_length=20, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile for {self.user.username}"

class UserState(models.Model):
    """
    Tracks user's mental and physical state at a point in time
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='states')
    timestamp = models.DateTimeField(default=timezone.now)
    mental_state = models.JSONField()  # Stores mental health metrics
    physical_state = models.JSONField()  # Stores physical health metrics

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', '-timestamp']),
        ]

class UserVisit(models.Model):
    """
    Records user visits to locations
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='visits')
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='visits')
    timestamp = models.DateTimeField(default=timezone.now)
    user_state = models.OneToOneField(UserState, on_delete=models.CASCADE, related_name='visit')
    duration = models.DurationField(null=True, blank=True)  # Optional duration of visit

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', '-timestamp']),
            models.Index(fields=['location', '-timestamp']),
        ]

class UserFeedback(models.Model):
    """
    Stores user feedback about their experience at a location
    """
    visit = models.OneToOneField(UserVisit, on_delete=models.CASCADE, related_name='feedback')
    timestamp = models.DateTimeField(default=timezone.now)
    mood_improvement = models.IntegerField(
        choices=[(i, str(i)) for i in range(-5, 6)],  # -5 to +5 scale
        help_text="How much did your mood improve? (-5 to +5)"
    )
    stress_reduction = models.IntegerField(
        choices=[(i, str(i)) for i in range(-5, 6)],
        help_text="How much did your stress reduce? (-5 to +5)"
    )
    energy_change = models.IntegerField(
        choices=[(i, str(i)) for i in range(-5, 6)],
        help_text="How did your energy level change? (-5 to +5)"
    )
    overall_satisfaction = models.IntegerField(
        choices=[(i, str(i)) for i in range(1, 6)],  # 1-5 scale
        help_text="Overall satisfaction with the location (1-5)"
    )
    comments = models.TextField(blank=True)

    def to_dict(self) -> dict:
        """Convert feedback to dictionary format"""
        return {
            'mood_improvement': self.mood_improvement,
            'stress_reduction': self.stress_reduction,
            'energy_change': self.energy_change,
            'overall_satisfaction': self.overall_satisfaction,
            'comments': self.comments,
            'timestamp': self.timestamp
        }

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['-timestamp']),
        ]

class Location(models.Model):
    """Physical locations with their environmental characteristics"""
    name = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    location_type = models.CharField(max_length=50, choices=[
        ('park', 'Park'),
        ('waterfront', 'Waterfront'),
        ('urban_green', 'Urban Green Space'),
        ('quiet_spot', 'Quiet Spot'),
        ('nature_reserve', 'Nature Reserve'),
        ('other', 'Other')
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Base environmental characteristics
    temperature_c = models.FloatField(null=True)
    humidity_percent = models.FloatField(null=True)
    air_quality_index = models.FloatField(null=True)
    ndvi_index = models.FloatField(null=True)  # Greenness
    noise_level_db = models.FloatField(null=True)
    pressure_hpa = models.FloatField(null=True)
    proximity_to_water_m = models.FloatField(null=True)
    altitude_m = models.FloatField(null=True)
    sunlight_level = models.CharField(max_length=20, null=True)
    urban_density = models.FloatField(null=True)  # people/km²

    # Additional air quality metrics
    pm25 = models.FloatField(null=True)
    pm10 = models.FloatField(null=True)
    o3 = models.FloatField(null=True)
    no2 = models.FloatField(null=True)

    # Aggregated scores (Phase 2+)
    health_index = models.FloatField(null=True)
    environmental_score = models.FloatField(null=True)
    tranquility_score = models.FloatField(null=True)
    accessibility_score = models.FloatField(null=True)

    def __str__(self):
        return f"{self.name} ({self.latitude}, {self.longitude})"

class Visit(models.Model):
    """Records of user visits to locations with feedback"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='visits')
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='visits')
    initial_state = models.ForeignKey(UserState, on_delete=models.CASCADE, related_name='visits')
    timestamp = models.DateTimeField(auto_now_add=True)
    
    # Environmental conditions during visit
    weather_conditions = models.JSONField(null=True)
    temperature_c = models.FloatField(null=True)
    humidity_percent = models.FloatField(null=True)
    air_quality_index = models.FloatField(null=True)
    noise_level_db = models.FloatField(null=True)
    
    # Visit context
    duration_minutes = models.IntegerField(null=True)
    visit_context = models.CharField(max_length=50, null=True)
    crowd_level = models.IntegerField(null=True, validators=[MinValueValidator(1), MaxValueValidator(10)])
    
    # Feedback (collected after visit)
    mood_improvement = models.IntegerField(null=True, validators=[MinValueValidator(-5), MaxValueValidator(5)])
    stress_reduction = models.IntegerField(null=True, validators=[MinValueValidator(-5), MaxValueValidator(5)])
    energy_impact = models.IntegerField(null=True, validators=[MinValueValidator(-5), MaxValueValidator(5)])
    focus_improvement = models.IntegerField(null=True, validators=[MinValueValidator(-5), MaxValueValidator(5)])
    overall_satisfaction = models.IntegerField(null=True, validators=[MinValueValidator(1), MaxValueValidator(10)])
    
    # Additional feedback
    activities_performed = models.JSONField(null=True)
    comments = models.TextField(null=True, blank=True)
    would_revisit = models.BooleanField(null=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user.username}'s visit to {self.location.name} at {self.timestamp}"

class PersonalizedModel(models.Model):
    """Stores personalized recommendation model data for each user"""
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Model metadata
    visits_count = models.IntegerField(default=0)
    model_version = models.CharField(max_length=50)
    last_training_date = models.DateTimeField(null=True)
    
    # Model parameters (stored as JSON)
    model_parameters = models.JSONField(null=True)
    feature_importance = models.JSONField(null=True)
    
    # Performance metrics
    accuracy_score = models.FloatField(null=True)
    mean_error = models.FloatField(null=True)
    
    # User preferences learned from data
    preferred_conditions = models.JSONField(null=True)
    avoided_conditions = models.JSONField(null=True)

    def __str__(self):
        return f"Model for {self.user.username} (v{self.model_version})"

    def is_ready(self):
        """Check if enough data is available for personalized recommendations"""
        return self.visits_count >= 5  # Minimum visits for personalization

class LocationCharacteristics(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='characteristics')
    timestamp = models.DateTimeField()
    
    # Basic characteristics
    temperature = models.FloatField()
    humidity = models.FloatField()
    air_pressure = models.FloatField()
    air_quality = models.FloatField()
    elevation = models.FloatField()
    sunshine_hours = models.FloatField()
    wind_speed = models.FloatField()
    precipitation = models.FloatField()
    uv_index = models.FloatField()
    noise_level = models.FloatField()
    
    # Additional air quality metrics
    pm25 = models.FloatField(null=True, blank=True)
    pm10 = models.FloatField(null=True, blank=True)
    o3 = models.FloatField(null=True, blank=True)
    no2 = models.FloatField(null=True, blank=True)
    
    # Noise metrics
    day_noise_level = models.FloatField(null=True, blank=True)
    night_noise_level = models.FloatField(null=True, blank=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"Characteristics for {self.location.name} at {self.timestamp}"

    def to_dict(self):
        return {
            'temperature': self.temperature,
            'humidity': self.humidity,
            'air_pressure': self.air_pressure,
            'air_quality': self.air_quality,
            'elevation': self.elevation,
            'sunshine_hours': self.sunshine_hours,
            'wind_speed': self.wind_speed,
            'precipitation': self.precipitation,
            'uv_index': self.uv_index,
            'noise_level': self.noise_level,
            'pm25': self.pm25,
            'pm10': self.pm10,
            'o3': self.o3,
            'no2': self.no2,
            'day_noise_level': self.day_noise_level,
            'night_noise_level': self.night_noise_level
        }

class HealthIndex(models.Model):
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='health_indices')
    timestamp = models.DateTimeField()
    overall_score = models.FloatField()
    environmental_score = models.FloatField()
    climate_score = models.FloatField()
    air_quality_score = models.FloatField()
    noise_score = models.FloatField()
    recommendations = models.JSONField()

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"Health Index for {self.location.name}: {self.overall_score}"

    def to_dict(self):
        return {
            'overall_health_index': self.overall_score,
            'component_scores': {
                'environmental': self.environmental_score,
                'climate': self.climate_score,
                'air_quality': self.air_quality_score,
                'noise': self.noise_score
            },
            'recommendations': self.recommendations,
            'timestamp': self.timestamp
        }

# New models for data collection

class LocationSelection(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='location_selections')
    user_state = models.ForeignKey(UserState, on_delete=models.CASCADE, related_name='location_selections')
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='user_selections')
    timestamp = models.DateTimeField(auto_now_add=True)
    
    # Selection context
    current_location_lat = models.FloatField(null=True, blank=True)
    current_location_lon = models.FloatField(null=True, blank=True)
    search_radius_km = models.FloatField(default=20.0)
    
    # Other locations that were suggested but not selected
    other_suggestions = models.ManyToManyField(
        Location, 
        through='SuggestedLocation',
        related_name='suggested_in'
    )
    
    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user.username} selected {self.location.name} at {self.timestamp}"

class SuggestedLocation(models.Model):
    selection = models.ForeignKey(LocationSelection, on_delete=models.CASCADE)
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    similarity_score = models.FloatField()
    health_index_score = models.FloatField()
    combined_score = models.FloatField()
    rank = models.IntegerField()
    
    class Meta:
        ordering = ['rank']

class LocationFeedback(models.Model):
    selection = models.ForeignKey(LocationSelection, on_delete=models.CASCADE, related_name='feedback')
    timestamp = models.DateTimeField(auto_now_add=True)
    
    # Outcome metrics (-5 to +5 scale, where 0 is neutral)
    mood_impact = models.IntegerField()
    stress_impact = models.IntegerField()
    energy_impact = models.IntegerField()
    overall_satisfaction = models.IntegerField()
    
    # Duration of stay
    visit_duration = models.DurationField(null=True, blank=True)
    
    # Qualitative feedback
    activities_performed = models.JSONField(null=True, blank=True)
    comments = models.TextField(null=True, blank=True)
    
    # Environmental conditions during visit
    weather_conditions = models.JSONField(null=True, blank=True)
    crowding_level = models.IntegerField(null=True, blank=True)  # 0-10 scale
    
    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"Feedback for {self.selection.location.name} from {self.selection.user.username}"
