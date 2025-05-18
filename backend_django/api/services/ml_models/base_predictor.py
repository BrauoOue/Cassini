import numpy as np
from sklearn.preprocessing import MinMaxScaler
from typing import Dict, List, Tuple

class BasePredictor:
    """Base class for ML predictors with common functionality"""
    
    def __init__(self):
        self.feature_ranges = {
            # Mental state ranges (1-10)
            'mood_level': (1, 10),
            'stress_level': (1, 10),
            'anxiety_level': (1, 10),
            'fatigue_level': (1, 10),
            'sleep_quality': (1, 10),
            'focus_level': (1, 10),
            'social_desire': (1, 10),
            'activity_level': (1, 10),
            
            # Physical metrics
            'heart_rate': (60, 100),
            
            # Target geographical characteristics
            'temperature_c': (15, 30),
            'humidity_percent': (40, 70),
            'air_quality_index': (0, 100),
            'ndvi_index': (0, 1),
            'noise_level_db': (30, 70),
            'pressure_hpa': (980, 1020),
            'proximity_to_water_m': (0, 1000),
            'altitude_m': (200, 1100),
            'urban_density': (0, 5000)
        }
        
        self.feature_weights = {
            # Mental state importance weights
            'mood_level': 1.0,
            'stress_level': 1.2,
            'anxiety_level': 1.1,
            'fatigue_level': 0.9,
            'sleep_quality': 0.8,
            'focus_level': 0.7,
            'social_desire': 0.6,
            'activity_level': 0.8,
            'heart_rate': 0.5
        }
        
        self.scalers = {
            'input': MinMaxScaler(),
            'output': MinMaxScaler()
        }
        
    def normalize_features(self, features: Dict[str, float], scaler_key: str = 'input') -> np.ndarray:
        """Normalize features to 0-1 range"""
        feature_array = np.array([features[k] for k in sorted(features.keys())])
        feature_array = feature_array.reshape(1, -1)
        
        if not hasattr(self.scalers[scaler_key], 'n_features_in_'):
            # First time fitting
            self.scalers[scaler_key].fit(feature_array)
        
        return self.scalers[scaler_key].transform(feature_array)
    
    def denormalize_features(self, normalized: np.ndarray, scaler_key: str = 'output') -> np.ndarray:
        """Convert normalized values back to original scale"""
        return self.scalers[scaler_key].inverse_transform(normalized)
    
    def calculate_similarity(self, pred_chars: Dict[str, float], actual_chars: Dict[str, float]) -> float:
        """Calculate similarity between predicted and actual characteristics"""
        common_keys = set(pred_chars.keys()) & set(actual_chars.keys())
        if not common_keys:
            return 0.0
        
        similarities = []
        for key in common_keys:
            range_min, range_max = self.feature_ranges.get(key, (0, 1))
            range_size = range_max - range_min
            
            # Calculate normalized difference
            diff = abs(pred_chars[key] - actual_chars[key]) / range_size
            similarity = 1 - min(1, diff)
            similarities.append(similarity)
        
        return np.mean(similarities)
    
    def validate_user_state(self, user_state: Dict) -> Tuple[bool, str]:
        """Validate user state data"""
        required_fields = [
            'mood_level', 'stress_level', 'fatigue_level',
            'sleep_quality', 'focus_level', 'activity_level'
        ]
        
        # Check required fields
        missing_fields = [field for field in required_fields if field not in user_state]
        if missing_fields:
            return False, f"Missing required fields: {', '.join(missing_fields)}"
        
        # Validate ranges
        for field, value in user_state.items():
            if field in self.feature_ranges:
                min_val, max_val = self.feature_ranges[field]
                if not min_val <= value <= max_val:
                    return False, f"{field} must be between {min_val} and {max_val}"
        
        return True, "Valid"
    
    def get_optimal_characteristics(self, user_state: Dict[str, float]) -> Dict[str, float]:
        """
        Get optimal geographical characteristics based on user state.
        This should be implemented by specific predictor classes.
        """
        raise NotImplementedError("Subclasses must implement get_optimal_characteristics") 