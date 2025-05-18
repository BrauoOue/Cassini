from typing import Dict, List
from datetime import datetime, timedelta
from django.utils import timezone
from django.conf import settings
from .ml_models.health_index_predictor import HealthIndexPredictor
from ..models import Location, LocationCharacteristics, HealthIndex

class HealthIndexService:
    """Service for managing health indices and Copernicus data integration"""
    
    def __init__(self):
        self.predictor = HealthIndexPredictor()
        self.update_interval = timedelta(hours=3)  # Update every 3 hours
        
        # Initialize default thresholds for health components
        self.thresholds = {
            'air_quality': {
                'good': 80,
                'moderate': 60,
                'poor': 40
            },
            'environmental': {
                'good': 75,
                'moderate': 50,
                'poor': 30
            },
            'climate': {
                'good': 80,
                'moderate': 60,
                'poor': 40
            },
            'noise': {
                'good': 75,
                'moderate': 50,
                'poor': 30
            }
        }

    def update_health_indices(self) -> None:
        """
        Update health indices for all locations if needed
        """
        # Check if model needs training
        self.predictor.train_model()
        
        # Get locations needing updates
        cutoff_time = timezone.now() - self.update_interval
        locations = Location.objects.filter(
            health_indices__isnull=True
        ).union(
            Location.objects.filter(
                health_indices__timestamp__lt=cutoff_time
            )
        ).distinct()
        
        # Update indices
        for location in locations:
            try:
                self.update_location_health_index(location)
            except Exception as e:
                print(f"Error updating health index for {location.name}: {str(e)}")

    def update_location_health_index(self, location: Location) -> Dict:
        """
        Update health index for a specific location
        """
        # Get latest characteristics
        chars = location.characteristics.first()
        if not chars:
            # No characteristics available, try to fetch from Copernicus
            self._fetch_copernicus_data(location)
            chars = location.characteristics.first()
        
        if not chars:
            return self.predictor._generate_default_health_index()
        
        # Predict health index
        return self.predictor.predict_health_index(location.id)

    def _fetch_copernicus_data(self, location: Location) -> None:
        """
        Fetch latest data from Copernicus for a location
        """
        try:
            # This would normally use the Copernicus API client
            # For now, we'll use placeholder data
            characteristics = {
                'temperature': 22.0,
                'humidity': 55.0,
                'air_pressure': 1015.0,
                'air_quality': 45.0,
                'elevation': location.altitude_m or 300.0,
                'sunshine_hours': 7.0,
                'wind_speed': 8.0,
                'precipitation': 0.0,
                'uv_index': 4.0,
                'noise_level': 50.0,
                'pm25': 8.0,
                'pm10': 15.0,
                'o3': 80.0,
                'no2': 35.0,
                'day_noise_level': 55.0,
                'night_noise_level': 45.0
            }
            
            # Create new characteristics record
            LocationCharacteristics.objects.create(
                location=location,
                timestamp=timezone.now(),
                **characteristics
            )
            
        except Exception as e:
            print(f"Error fetching Copernicus data: {str(e)}")

    def get_location_health_status(self, location_id: int) -> Dict:
        """
        Get detailed health status for a location
        """
        try:
            location = Location.objects.get(id=location_id)
            health_index = location.health_indices.first()
            
            if not health_index:
                health_index = self.update_location_health_index(location)
            
            status = health_index.to_dict()
            
            # Add interpretations
            status['interpretations'] = self._generate_interpretations(
                status['component_scores']
            )
            
            return status
            
        except Location.DoesNotExist:
            return {
                'error': 'Location not found',
                'status': None
            }

    def _generate_interpretations(self, scores: Dict[str, float]) -> Dict[str, str]:
        """
        Generate human-readable interpretations of health scores
        """
        interpretations = {}
        
        for component, score in scores.items():
            if score >= self.thresholds[component]['good']:
                status = 'Excellent'
                message = 'Ideal conditions for wellbeing.'
            elif score >= self.thresholds[component]['moderate']:
                status = 'Good'
                message = 'Generally favorable conditions.'
            elif score >= self.thresholds[component]['poor']:
                status = 'Moderate'
                message = 'Some aspects could be improved.'
            else:
                status = 'Poor'
                message = 'Conditions may affect wellbeing.'
            
            interpretations[component] = {
                'status': status,
                'message': message
            }
        
        return interpretations

    def get_health_trends(self, location_id: int, days: int = 7) -> Dict:
        """
        Get health index trends for a location
        """
        try:
            location = Location.objects.get(id=location_id)
            cutoff_date = timezone.now() - timedelta(days=days)
            
            indices = location.health_indices.filter(
                timestamp__gte=cutoff_date
            ).order_by('timestamp')
            
            trends = {
                'timestamps': [],
                'overall_scores': [],
                'component_scores': {
                    'environmental': [],
                    'climate': [],
                    'air_quality': [],
                    'noise': []
                }
            }
            
            for index in indices:
                trends['timestamps'].append(index.timestamp)
                trends['overall_scores'].append(index.overall_score)
                trends['component_scores']['environmental'].append(index.environmental_score)
                trends['component_scores']['climate'].append(index.climate_score)
                trends['component_scores']['air_quality'].append(index.air_quality_score)
                trends['component_scores']['noise'].append(index.noise_score)
            
            return trends
            
        except Location.DoesNotExist:
            return {
                'error': 'Location not found',
                'trends': None
            } 