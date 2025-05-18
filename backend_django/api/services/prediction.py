import numpy as np
from typing import Dict, List
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
from django.utils import timezone
from ..models import Location, LocationCharacteristics, UserVisit, UserState, UserFeedback
from .location_service import LocationService

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
        """
        model = XGBRegressor(
            n_estimators=100,
            learning_rate=0.1,
            max_depth=5,
            random_state=42
        )
        return model

    def _create_characteristic_model(self) -> RandomForestRegressor:
        """
        Initialize and return the characteristic prediction model
        """
        model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        return model

    def predict(self, mental_state: Dict, physical_state: Dict,
               user_latitude: float = None, user_longitude: float = None,
               radius_km: float = 20.0) -> Dict:
        """
        Predict optimal location based on user state
        """
        # Create feature vector from user state
        features = self._create_feature_vector(mental_state, physical_state)
        
        # Predict optimal characteristics
        characteristics = self._predict_characteristics(features)
        
        # If user location is provided, find similar locations nearby
        similar_locations = []
        if user_latitude is not None and user_longitude is not None:
            similar_locations = self.location_service.find_similar_locations(
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

    def _create_feature_vector(self, mental_state: Dict, physical_state: Dict) -> List[float]:
        """
        Create normalized feature vector from user state
        """
        # Mental state normalization
        mental_features = []
        for key in ["stress_level", "anxiety_level", "mood", "sleep_quality", 
                   "energy_level", "focus_level", "motivation"]:
            mental_features.append(mental_state.get(key, 5.0) / 10.0)
        
        # Physical state normalization
        physical_features = []
        for key, (min_val, max_val) in {
            "heart_rate": (60, 100),
            "blood_pressure_systolic": (90, 140),
            "blood_pressure_diastolic": (60, 90),
            "body_temperature": (36, 38),
            "respiratory_rate": (12, 20)
        }.items():
            value = physical_state.get(key, (min_val + max_val) / 2)
            physical_features.append((value - min_val) / (max_val - min_val))
        
        # Add physical activity and pain level
        for key in ["physical_activity_level", "pain_level"]:
            physical_features.append(physical_state.get(key, 5.0) / 10.0)
        
        return mental_features + physical_features

    def _predict_characteristics(self, features: List[float]) -> Dict[str, float]:
        """
        Predict optimal geographical characteristics
        """
        # In a real implementation, this would use the characteristic_model
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
        Calculate improvement score based on characteristics
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

    def log_visit(self, user_id: int, location_id: int, 
                 mental_state: Dict, physical_state: Dict) -> UserVisit:
        """
        Log a user's visit to a location along with their state
        """
        # Create user state record
        user_state = UserState.objects.create(
            user_id=user_id,
            timestamp=timezone.now(),
            mental_state=mental_state,
            physical_state=physical_state
        )
        
        # Create visit record
        visit = UserVisit.objects.create(
            user_id=user_id,
            location_id=location_id,
            timestamp=timezone.now(),
            user_state=user_state
        )
        
        return visit

    def record_feedback(self, visit_id: int, feedback_data: Dict) -> UserFeedback:
        """
        Record user feedback for a visit
        """
        visit = UserVisit.objects.get(id=visit_id)
        
        feedback = UserFeedback.objects.create(
            visit=visit,
            timestamp=timezone.now(),
            mood_improvement=feedback_data.get('mood_improvement', 0),
            stress_reduction=feedback_data.get('stress_reduction', 0),
            energy_change=feedback_data.get('energy_change', 0),
            overall_satisfaction=feedback_data.get('overall_satisfaction', 0),
            comments=feedback_data.get('comments', '')
        )
        
        return feedback

    def get_user_visit_history(self, user_id: int, 
                             days: int = 30) -> List[Dict]:
        """
        Get user's visit history with associated states and feedback
        """
        cutoff_date = timezone.now() - timezone.timedelta(days=days)
        
        visits = UserVisit.objects.filter(
            user_id=user_id,
            timestamp__gte=cutoff_date
        ).select_related(
            'location',
            'user_state',
            'feedback'
        ).order_by('-timestamp')
        
        history = []
        for visit in visits:
            history.append({
                'visit_id': visit.id,
                'location_name': visit.location.name,
                'timestamp': visit.timestamp,
                'mental_state': visit.user_state.mental_state,
                'physical_state': visit.user_state.physical_state,
                'feedback': visit.feedback.to_dict() if visit.feedback else None
            })
        
        return history 