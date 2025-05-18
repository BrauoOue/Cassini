from pydantic import BaseModel, Field
from typing import Dict, Optional

class UserState(BaseModel):
    mental_state: Dict[str, float] = Field(
        ...,
        description="Dictionary containing mental state metrics",
        example={
            "stress_level": 7.5,
            "anxiety_level": 6.0,
            "mood": 5.0,
            "sleep_quality": 6.5,
            "energy_level": 4.0,
            "focus_level": 5.5,
            "motivation": 6.0
        }
    )
    
    physical_state: Dict[str, float] = Field(
        ...,
        description="Dictionary containing physical state metrics",
        example={
            "heart_rate": 75.0,
            "blood_pressure_systolic": 120.0,
            "blood_pressure_diastolic": 80.0,
            "body_temperature": 36.6,
            "respiratory_rate": 16.0,
            "physical_activity_level": 6.0,
            "pain_level": 2.0
        }
    )

    def normalize_values(self) -> Dict[str, float]:
        """
        Normalize all values to a 0-1 scale for ML model input
        """
        normalized = {}
        
        # Mental state normalization
        for key, value in self.mental_state.items():
            if key in ["stress_level", "anxiety_level", "mood", "sleep_quality", 
                      "energy_level", "focus_level", "motivation"]:
                normalized[f"mental_{key}"] = value / 10.0
        
        # Physical state normalization
        for key, value in self.physical_state.items():
            if key == "heart_rate":
                normalized[key] = (value - 60) / (100 - 60)  # Normal range 60-100
            elif key == "blood_pressure_systolic":
                normalized[key] = (value - 90) / (140 - 90)  # Normal range 90-140
            elif key == "blood_pressure_diastolic":
                normalized[key] = (value - 60) / (90 - 60)   # Normal range 60-90
            elif key == "body_temperature":
                normalized[key] = (value - 36) / (38 - 36)   # Normal range 36-38
            elif key == "respiratory_rate":
                normalized[key] = (value - 12) / (20 - 12)   # Normal range 12-20
            elif key in ["physical_activity_level", "pain_level"]:
                normalized[f"physical_{key}"] = value / 10.0
        
        return normalized

    def get_feature_vector(self) -> list:
        """
        Convert the normalized state into a feature vector for ML model
        """
        normalized = self.normalize_values()
        # Define the order of features for the ML model
        feature_order = [
            "mental_stress_level", "mental_anxiety_level", "mental_mood",
            "mental_sleep_quality", "mental_energy_level", "mental_focus_level",
            "mental_motivation", "heart_rate", "blood_pressure_systolic",
            "blood_pressure_diastolic", "body_temperature", "respiratory_rate",
            "physical_physical_activity_level", "physical_pain_level"
        ]
        
        return [normalized.get(feature, 0.0) for feature in feature_order] 