import numpy as np
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from typing import Dict, Tuple, List
from models.user_state import UserState
from services.location_service import LocationService

class WellbeingPredictor:
    def __init__(self):
        # Initialize the models
        self.location_model = self._create_location_model()
        self.characteristic_model = self._create_characteristic_model()
        self.location_service = LocationService()
        
        # Define the optimal ranges for geographical characteristics
        self.optimal_ranges = {
            'temperature': (18, 25),        # Celsius
            'humidity': (40, 60),           # Percentage
            'air_pressure': (1010, 1020),   # hPa
            'air_quality': (0, 50),         # AQI
            'elevation': (0, 1000),         # meters
            'sunshine_hours': (6, 8),       # hours per day
            'wind_speed': (5, 15),          # km/h
            'precipitation': (0, 5),        # mm/day
            'uv_index': (3, 5),            # UV index
            'noise_level': (40, 60)         # dB
        }

    def _create_location_model(self) -> XGBRegressor:
        """
        Initialize and return the location prediction model
        In a real implementation, this would load a pre-trained model
        """
        model = XGBRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        )
        # Here we would normally load the model weights
        # model.load_model('path_to_model')
        return model

    def _create_characteristic_model(self) -> RandomForestRegressor:
        """
        Initialize and return the characteristic prediction model
        In a real implementation, this would load a pre-trained model
        """
        model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        # Here we would normally load the model weights
        return model

    async def predict(self, user_state: UserState, user_latitude: float = None, 
                     user_longitude: float = None, radius_km: float = 20.0) -> Dict:
        """
        Predict the optimal location and characteristics based on user state
        """
        # Get the feature vector
        features = user_state.get_feature_vector()
        
        # Predict optimal characteristics
        characteristics = self._predict_characteristics(features)
        
        # If user location is provided, find similar locations nearby
        similar_locations = []
        if user_latitude is not None and user_longitude is not None:
            similar_locations = await self.location_service.find_similar_locations(
                characteristics,
                user_latitude,
                user_longitude,
                radius_km
            )
        
        # If we found similar locations, use the best match
        if similar_locations:
            best_match = similar_locations[0]
            return {
                "latitude": best_match['latitude'],
                "longitude": best_match['longitude'],
                "confidence": best_match['similarity_score'],
                "characteristics": best_match['characteristics'],
                "improvement_score": self._calculate_improvement_score(best_match['characteristics']),
                "location_name": best_match['name'],
                "distance_km": best_match['distance_km'],
                "similar_locations": similar_locations[:5]  # Return top 5 matches
            }
        
        # Fallback to model prediction if no similar locations found
        mock_lat = 40 + (sum(features[:7]) / 7) * 10  # Mental state affects latitude
        mock_lon = -5 + (sum(features[7:]) / 7) * 10  # Physical state affects longitude
        
        return {
            "latitude": float(mock_lat),
            "longitude": float(mock_lon),
            "confidence": 0.85,
            "characteristics": characteristics,
            "improvement_score": self._calculate_improvement_score(characteristics)
        }

    def _predict_characteristics(self, features: list) -> Dict[str, float]:
        """
        Predict optimal geographical characteristics based on user state
        """
        # In a real implementation, this would use the characteristic_model
        # For now, we'll return mock predictions
        return {
            'temperature': 22.5,
            'humidity': 50,
            'air_pressure': 1015,
            'air_quality': 30,
            'elevation': 500,
            'sunshine_hours': 7,
            'wind_speed': 10,
            'precipitation': 2,
            'uv_index': 4,
            'noise_level': 50
        }

    def _calculate_improvement_score(self, characteristics: Dict[str, float]) -> float:
        """
        Calculate how much improvement the predicted location might bring
        """
        scores = []
        for key, value in characteristics.items():
            if key in self.optimal_ranges:
                min_val, max_val = self.optimal_ranges[key]
                if min_val <= value <= max_val:
                    scores.append(1.0)
                else:
                    distance = min(abs(value - min_val), abs(value - max_val))
                    range_size = max_val - min_val
                    scores.append(max(0, 1 - (distance / range_size)))
        
        return sum(scores) / len(scores) if scores else 0.0 