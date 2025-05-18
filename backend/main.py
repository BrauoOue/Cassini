from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict
import uvicorn
from models.prediction import WellbeingPredictor
from models.user_state import UserState
from services.copernicus_service import CopernicusService

app = FastAPI(
    title="Wellbeing Location Predictor API",
    description="API for predicting optimal locations based on mental and physical state",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
predictor = WellbeingPredictor()
copernicus_service = CopernicusService()

class UserStateInput(BaseModel):
    mental_state: dict
    physical_state: dict
    current_latitude: Optional[float] = None
    current_longitude: Optional[float] = None
    search_radius_km: Optional[float] = 20.0

class SimilarLocation(BaseModel):
    name: str
    latitude: float
    longitude: float
    distance_km: float
    similarity_score: float
    characteristics: Dict[str, float]

class LocationPrediction(BaseModel):
    latitude: float
    longitude: float
    confidence: float
    characteristics: dict
    improvement_score: float
    location_name: Optional[str] = None
    distance_km: Optional[float] = None
    similar_locations: Optional[List[SimilarLocation]] = None

@app.post("/predict/location", response_model=LocationPrediction)
async def predict_location(user_state: UserStateInput):
    try:
        # Convert input to UserState model
        state = UserState(
            mental_state=user_state.mental_state,
            physical_state=user_state.physical_state
        )
        
        # Get prediction with location matching if coordinates provided
        prediction = await predictor.predict(
            state,
            user_latitude=user_state.current_latitude,
            user_longitude=user_state.current_longitude,
            radius_km=user_state.search_radius_km
        )
        
        return LocationPrediction(**prediction)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 