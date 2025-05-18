import numpy as np
from typing import Dict, List
from django.utils import timezone
from datetime import timedelta
from geopy.distance import geodesic
from ..models import Location, LocationCharacteristics, HealthIndex
from .copernicus_service import CopernicusService
from .health_index_service import HealthIndexService

class LocationService:
    def __init__(self):
        self.copernicus_service = CopernicusService()
        self.health_index_service = HealthIndexService()
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

    def find_similar_locations(self, 
                             target_characteristics: Dict[str, float],
                             user_latitude: float,
                             user_longitude: float,
                             radius_km: float = 20.0) -> List[Dict]:
        """
        Find locations similar to target characteristics within specified radius
        """
        # Update characteristics if needed
        self._update_characteristics()
        
        # Filter locations by radius
        nearby_locations = self._filter_by_radius(user_latitude, user_longitude, radius_km)
        
        # Calculate similarity scores and health indices
        location_scores = []
        for location in nearby_locations:
            # Get latest characteristics
            latest_chars = location.characteristics.first()
            if latest_chars:
                # Calculate similarity score
                similarity = self._calculate_similarity(
                    target_characteristics,
                    latest_chars.to_dict()
                )
                
                # Get or calculate health index
                health_index = self._get_health_index(location, latest_chars.to_dict())
                
                location_scores.append({
                    'name': location.name,
                    'latitude': location.latitude,
                    'longitude': location.longitude,
                    'distance_km': self._calculate_distance(
                        user_latitude, user_longitude,
                        location.latitude, location.longitude
                    ),
                    'similarity_score': similarity,
                    'characteristics': latest_chars.to_dict(),
                    'health_index': health_index.to_dict()
                })
        
        # Sort by combined score (similarity and health index)
        for loc in location_scores:
            loc['combined_score'] = (
                loc['similarity_score'] * 0.6 +  # 60% weight on similarity
                (loc['health_index']['overall_health_index'] / 100) * 0.4  # 40% weight on health
            )
        
        location_scores.sort(key=lambda x: x['combined_score'], reverse=True)
        return location_scores

    def _filter_by_radius(self, center_lat: float, center_lon: float, 
                         radius_km: float) -> List[Location]:
        """
        Filter locations within specified radius
        """
        locations = Location.objects.all()
        nearby = []
        center = (center_lat, center_lon)
        
        for location in locations:
            distance = self._calculate_distance(
                center_lat, center_lon,
                location.latitude, location.longitude
            )
            if distance <= radius_km:
                nearby.append(location)
        
        return nearby

    def _calculate_distance(self, lat1: float, lon1: float, 
                          lat2: float, lon2: float) -> float:
        """
        Calculate distance between two points in kilometers
        """
        return geodesic((lat1, lon1), (lat2, lon2)).kilometers

    def _calculate_similarity(self, 
                            target: Dict[str, float], 
                            candidate: Dict[str, float]) -> float:
        """
        Calculate weighted cosine similarity between target and candidate characteristics
        """
        common_features = set(target.keys()) & set(candidate.keys())
        
        if not common_features:
            return 0.0
        
        target_vector = []
        candidate_vector = []
        weights = []
        
        for feature in common_features:
            target_vector.append(target[feature])
            candidate_vector.append(candidate[feature])
            weights.append(self.feature_weights.get(feature, 1.0))
        
        target_vector = np.array(target_vector) * np.array(weights)
        candidate_vector = np.array(candidate_vector) * np.array(weights)
        
        dot_product = np.dot(target_vector, candidate_vector)
        target_norm = np.linalg.norm(target_vector)
        candidate_norm = np.linalg.norm(candidate_vector)
        
        if target_norm == 0 or candidate_norm == 0:
            return 0.0
            
        similarity = dot_product / (target_norm * candidate_norm)
        return float(similarity)

    def _update_characteristics(self):
        """
        Update characteristics for locations if they're outdated
        """
        current_time = timezone.now()
        update_threshold = current_time - self.cache_duration
        
        # Get locations needing updates
        locations = Location.objects.filter(
            characteristics__isnull=True
        ).union(
            Location.objects.filter(
                characteristics__timestamp__lt=update_threshold
            )
        ).distinct()
        
        # Update characteristics and health indices
        for location in locations:
            # Get new characteristics
            characteristics = self.copernicus_service.get_location_data(
                location.latitude,
                location.longitude
            )
            
            # Create new characteristics record
            new_chars = LocationCharacteristics.objects.create(
                location=location,
                timestamp=current_time,
                **characteristics
            )
            
            # Calculate and save health index
            self._get_health_index(location, characteristics)

    def _get_health_index(self, location: Location, 
                         characteristics: Dict[str, float]) -> HealthIndex:
        """
        Get or calculate health index for a location
        """
        # Check for recent health index
        recent_index = location.health_indices.first()
        if recent_index and recent_index.timestamp > timezone.now() - self.cache_duration:
            return recent_index
        
        # Calculate new health index
        health_data = self.health_index_service.calculate_health_index({
            **characteristics,
            'green_space_ratio': location.green_space_ratio,
            'water_quality': location.water_quality,
            'biodiversity': location.biodiversity
        })
        
        # Save and return new health index
        return HealthIndex.objects.create(
            location=location,
            timestamp=timezone.now(),
            overall_score=health_data['overall_health_index'],
            environmental_score=health_data['component_scores']['environmental'],
            climate_score=health_data['component_scores']['climate'],
            air_quality_score=health_data['component_scores']['air_quality'],
            noise_score=health_data['component_scores']['noise'],
            recommendations=health_data['recommendations']
        ) 