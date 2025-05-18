import numpy as np
from typing import Dict, List, Tuple
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import MinMaxScaler
from datetime import datetime, timedelta
from django.utils import timezone
from .base_predictor import BasePredictor
from ...models import Location, LocationCharacteristics, HealthIndex

class HealthIndexPredictor(BasePredictor):
    """
    Predicts health index scores based on geographical characteristics
    using Copernicus satellite data and historical health metrics
    """
    
    def __init__(self):
        super().__init__()
        
        # Initialize model for health index prediction
        self.model = self._create_model()
        self.last_training_time = None
        self.training_interval = timedelta(days=7)  # Retrain weekly
        self.min_samples_for_training = 50  # Minimum samples needed for training
        
        # Feature importance tracking
        self.feature_importance = {}
        
        # Define component weights for overall health index
        self.component_weights = {
            'air_quality': 0.3,
            'climate': 0.25,
            'environmental': 0.25,
            'noise': 0.2
        }
        
        # Define optimal ranges for health components
        self.optimal_ranges.update({
            # Air quality components (μg/m³)
            'pm25': (0, 10),
            'pm10': (0, 20),
            'o3': (0, 100),
            'no2': (0, 40),
            
            # Climate components
            'temperature_c': (18, 25),
            'humidity_percent': (40, 60),
            'wind_speed': (2, 10),
            
            # Environmental components
            'ndvi_index': (0.6, 1.0),
            'urban_density': (0, 2000),
            'proximity_to_water_m': (0, 500),
            
            # Noise components (dB)
            'day_noise_level': (45, 55),
            'night_noise_level': (40, 50)
        })

    def _create_model(self) -> GradientBoostingRegressor:
        """
        Initialize the gradient boosting model for health index prediction
        """
        return GradientBoostingRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        )

    def predict_health_index(self, location_id: int) -> Dict:
        """
        Predict health index for a location using current characteristics
        """
        # Get location and its latest characteristics
        location = Location.objects.get(id=location_id)
        characteristics = location.characteristics.first()
        
        if not characteristics:
            return self._generate_default_health_index()
        
        # Calculate component scores
        air_quality_score = self._calculate_air_quality_score(characteristics)
        climate_score = self._calculate_climate_score(characteristics)
        environmental_score = self._calculate_environmental_score(characteristics)
        noise_score = self._calculate_noise_score(characteristics)
        
        # Calculate overall score
        overall_score = (
            air_quality_score * self.component_weights['air_quality'] +
            climate_score * self.component_weights['climate'] +
            environmental_score * self.component_weights['environmental'] +
            noise_score * self.component_weights['noise']
        )
        
        # Generate recommendations based on scores
        recommendations = self._generate_recommendations(
            air_quality_score,
            climate_score,
            environmental_score,
            noise_score
        )
        
        # Create and save health index
        health_index = HealthIndex.objects.create(
            location=location,
            timestamp=timezone.now(),
            overall_score=overall_score,
            environmental_score=environmental_score,
            climate_score=climate_score,
            air_quality_score=air_quality_score,
            noise_score=noise_score,
            recommendations=recommendations
        )
        
        return health_index.to_dict()

    def _calculate_air_quality_score(self, chars: LocationCharacteristics) -> float:
        """Calculate air quality component score"""
        metrics = {
            'pm25': chars.pm25,
            'pm10': chars.pm10,
            'o3': chars.o3,
            'no2': chars.no2
        }
        
        scores = []
        for metric, value in metrics.items():
            if value is not None:
                min_val, max_val = self.optimal_ranges[metric]
                score = 1.0 - min(1.0, max(0.0, (value - min_val) / (max_val - min_val)))
                scores.append(score)
        
        return np.mean(scores) if scores else 0.5

    def _calculate_climate_score(self, chars: LocationCharacteristics) -> float:
        """Calculate climate component score"""
        metrics = {
            'temperature_c': chars.temperature,
            'humidity_percent': chars.humidity,
            'wind_speed': chars.wind_speed
        }
        
        scores = []
        for metric, value in metrics.items():
            if value is not None:
                min_val, max_val = self.optimal_ranges[metric]
                if min_val <= value <= max_val:
                    scores.append(1.0)
                else:
                    distance = min(abs(value - min_val), abs(value - max_val))
                    range_size = max_val - min_val
                    scores.append(max(0, 1 - (distance / range_size)))
        
        return np.mean(scores) if scores else 0.5

    def _calculate_environmental_score(self, chars: LocationCharacteristics) -> float:
        """Calculate environmental component score"""
        location = chars.location
        metrics = {
            'ndvi_index': location.ndvi_index,
            'urban_density': location.urban_density,
            'proximity_to_water_m': location.proximity_to_water_m
        }
        
        scores = []
        for metric, value in metrics.items():
            if value is not None:
                min_val, max_val = self.optimal_ranges[metric]
                if min_val <= value <= max_val:
                    scores.append(1.0)
                else:
                    distance = min(abs(value - min_val), abs(value - max_val))
                    range_size = max_val - min_val
                    scores.append(max(0, 1 - (distance / range_size)))
        
        return np.mean(scores) if scores else 0.5

    def _calculate_noise_score(self, chars: LocationCharacteristics) -> float:
        """Calculate noise component score"""
        metrics = {
            'day_noise_level': chars.day_noise_level,
            'night_noise_level': chars.night_noise_level
        }
        
        scores = []
        for metric, value in metrics.items():
            if value is not None:
                min_val, max_val = self.optimal_ranges[metric]
                if min_val <= value <= max_val:
                    scores.append(1.0)
                else:
                    distance = min(abs(value - min_val), abs(value - max_val))
                    range_size = max_val - min_val
                    scores.append(max(0, 1 - (distance / range_size)))
        
        return np.mean(scores) if scores else 0.5

    def _generate_recommendations(self, air_score: float, climate_score: float,
                                env_score: float, noise_score: float) -> List[str]:
        """Generate recommendations based on component scores"""
        recommendations = []
        
        if air_score < 0.6:
            recommendations.append(
                "Air quality is suboptimal. Best visited during early morning or evening."
            )
        if climate_score < 0.6:
            recommendations.append(
                "Weather conditions may be challenging. Check forecast before visiting."
            )
        if env_score < 0.6:
            recommendations.append(
                "Environmental conditions are moderate. Consider alternative locations with more green space."
            )
        if noise_score < 0.6:
            recommendations.append(
                "Noise levels may be high. Bring noise-canceling headphones if seeking quiet."
            )
        
        return recommendations

    def _generate_default_health_index(self) -> Dict:
        """Generate default health index when no data is available"""
        return {
            'overall_health_index': 0.5,
            'component_scores': {
                'environmental': 0.5,
                'climate': 0.5,
                'air_quality': 0.5,
                'noise': 0.5
            },
            'recommendations': [
                "Limited data available. Health index is based on default values.",
                "Visit during optimal weather conditions for best experience."
            ],
            'timestamp': timezone.now()
        }

    def train_model(self) -> None:
        """
        Train the health index prediction model using historical data
        """
        # Check if enough time has passed since last training
        if (self.last_training_time and 
            timezone.now() - self.last_training_time < self.training_interval):
            return
        
        # Get historical data
        locations = Location.objects.all()
        if locations.count() < self.min_samples_for_training:
            return  # Not enough data for training
        
        features = []
        targets = []
        
        for location in locations:
            # Get latest characteristics and health index
            chars = location.characteristics.first()
            health_index = location.health_indices.first()
            
            if chars and health_index:
                # Extract features
                feature_vector = [
                    chars.temperature,
                    chars.humidity,
                    chars.air_pressure,
                    chars.air_quality,
                    chars.elevation,
                    chars.sunshine_hours,
                    chars.wind_speed,
                    chars.precipitation,
                    chars.uv_index,
                    chars.noise_level,
                    chars.pm25 or 0,
                    chars.pm10 or 0,
                    chars.o3 or 0,
                    chars.no2 or 0,
                    location.ndvi_index or 0,
                    location.urban_density or 0,
                    location.proximity_to_water_m or 0
                ]
                
                features.append(feature_vector)
                targets.append(health_index.overall_score)
        
        if len(features) >= self.min_samples_for_training:
            # Train the model
            X = np.array(features)
            y = np.array(targets)
            
            self.model.fit(X, y)
            
            # Update feature importance
            feature_names = [
                'temperature', 'humidity', 'air_pressure', 'air_quality',
                'elevation', 'sunshine_hours', 'wind_speed', 'precipitation',
                'uv_index', 'noise_level', 'pm25', 'pm10', 'o3', 'no2',
                'ndvi_index', 'urban_density', 'proximity_to_water'
            ]
            
            self.feature_importance = dict(zip(
                feature_names,
                self.model.feature_importances_
            ))
            
            self.last_training_time = timezone.now()

    def update_location_health_indices(self) -> None:
        """
        Update health indices for all locations using latest Copernicus data
        """
        locations = Location.objects.all()
        
        for location in locations:
            try:
                health_index = self.predict_health_index(location.id)
                print(f"Updated health index for {location.name}: {health_index['overall_health_index']}")
            except Exception as e:
                print(f"Error updating health index for {location.name}: {str(e)}") 