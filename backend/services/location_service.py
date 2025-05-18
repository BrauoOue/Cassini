import numpy as np
from typing import Dict, List, Tuple
from datetime import datetime, timedelta
from geopy.distance import geodesic
from services.copernicus_service import CopernicusService

class LocationService:
    def __init__(self):
        # Initialize Copernicus service for updates
        self.copernicus_service = CopernicusService()
        
        # Initialize predefined locations with their base characteristics
        # In production, this would be loaded from a database
        self.locations = {
            "location_1": {"name": "Central Park", "latitude": 40.7829, "longitude": -73.9654},
            "location_2": {"name": "Riverside Park", "latitude": 40.8010, "longitude": -73.9723},
            # Add more locations as needed
        }
        
        # Cache for location characteristics with timestamp
        self.characteristics_cache = {}
        self.cache_duration = timedelta(hours=1)  # Update every hour
        
        # Feature weights for similarity calculation
        self.feature_weights = {
            'temperature': 1.0,
            'humidity': 0.8,
            'air_pressure': 0.6,
            'air_quality': 1.0,
            'elevation': 0.7,
            'sunshine_hours': 0.9,
            'wind_speed': 0.6,
            'precipitation': 0.8,
            'uv_index': 0.7,
            'noise_level': 0.9
        }

    async def find_similar_locations(self, 
                                   target_characteristics: Dict[str, float],
                                   user_latitude: float,
                                   user_longitude: float,
                                   radius_km: float = 20.0) -> List[Dict]:
        """
        Find locations similar to target characteristics within specified radius
        """
        # Update characteristics cache if needed
        await self._update_characteristics_cache()
        
        # Filter locations by radius
        nearby_locations = self._filter_by_radius(user_latitude, user_longitude, radius_km)
        
        # Calculate similarity scores
        location_scores = []
        for loc_id, location in nearby_locations.items():
            if loc_id in self.characteristics_cache:
                similarity = self._calculate_similarity(
                    target_characteristics,
                    self.characteristics_cache[loc_id]['characteristics']
                )
                location_scores.append({
                    **location,
                    'similarity_score': similarity,
                    'characteristics': self.characteristics_cache[loc_id]['characteristics']
                })
        
        # Sort by similarity score
        location_scores.sort(key=lambda x: x['similarity_score'], reverse=True)
        return location_scores

    def _filter_by_radius(self, 
                         center_lat: float, 
                         center_lon: float, 
                         radius_km: float) -> Dict:
        """
        Filter locations within specified radius
        """
        nearby = {}
        center = (center_lat, center_lon)
        
        for loc_id, location in self.locations.items():
            loc_point = (location['latitude'], location['longitude'])
            distance = geodesic(center, loc_point).kilometers
            
            if distance <= radius_km:
                nearby[loc_id] = {**location, 'distance_km': distance}
        
        return nearby

    def _calculate_similarity(self, 
                            target: Dict[str, float], 
                            candidate: Dict[str, float]) -> float:
        """
        Calculate weighted cosine similarity between target and candidate characteristics
        """
        # Extract features present in both dictionaries
        common_features = set(target.keys()) & set(candidate.keys())
        
        if not common_features:
            return 0.0
        
        # Create feature vectors with weights
        target_vector = []
        candidate_vector = []
        weights = []
        
        for feature in common_features:
            target_vector.append(target[feature])
            candidate_vector.append(candidate[feature])
            weights.append(self.feature_weights.get(feature, 1.0))
        
        # Convert to numpy arrays and apply weights
        target_vector = np.array(target_vector) * np.array(weights)
        candidate_vector = np.array(candidate_vector) * np.array(weights)
        
        # Calculate cosine similarity
        dot_product = np.dot(target_vector, candidate_vector)
        target_norm = np.linalg.norm(target_vector)
        candidate_norm = np.linalg.norm(candidate_vector)
        
        if target_norm == 0 or candidate_norm == 0:
            return 0.0
            
        similarity = dot_product / (target_norm * candidate_norm)
        return float(similarity)

    async def _update_characteristics_cache(self):
        """
        Update cached characteristics if they're outdated
        """
        current_time = datetime.now()
        
        for loc_id, location in self.locations.items():
            # Check if cache needs update
            if (loc_id not in self.characteristics_cache or
                current_time - self.characteristics_cache[loc_id]['timestamp'] > self.cache_duration):
                
                # Fetch new characteristics
                characteristics = await self.copernicus_service.get_location_data(
                    location['latitude'],
                    location['longitude']
                )
                
                # Update cache
                self.characteristics_cache[loc_id] = {
                    'characteristics': characteristics,
                    'timestamp': current_time
                } 