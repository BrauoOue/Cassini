# Wellbeing Location Predictor Backend

This backend service predicts optimal locations for improving mental and physical wellbeing based on user state data and Copernicus satellite information.

## Features

- User state analysis (mental and physical metrics)
- Location prediction based on user state
- Integration with Copernicus satellite data
- Geographical characteristic optimization
- Historical data analysis

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
Create a `.env` file in the backend directory with:
```
COPERNICUS_API_KEY=your_api_key_here
```

4. Run the server:
```bash
uvicorn main:app --reload
```

The server will start at `http://localhost:8000`

## API Endpoints

### POST /predict/location

Predicts optimal location based on user state.

Request body:
```json
{
  "mental_state": {
    "stress_level": 7.5,
    "anxiety_level": 6.0,
    "mood": 5.0,
    "sleep_quality": 6.5,
    "energy_level": 4.0,
    "focus_level": 5.5,
    "motivation": 6.0
  },
  "physical_state": {
    "heart_rate": 75.0,
    "blood_pressure_systolic": 120.0,
    "blood_pressure_diastolic": 80.0,
    "body_temperature": 36.6,
    "respiratory_rate": 16.0,
    "physical_activity_level": 6.0,
    "pain_level": 2.0
  }
}
```

Response:
```json
{
  "latitude": 42.5,
  "longitude": 2.1,
  "confidence": 0.85,
  "characteristics": {
    "temperature": 22.5,
    "humidity": 50.0,
    "air_pressure": 1015.0,
    "air_quality": 30.0,
    "elevation": 500.0,
    "sunshine_hours": 7.0,
    "wind_speed": 10.0,
    "precipitation": 2.0,
    "uv_index": 4.0,
    "noise_level": 50.0
  },
  "improvement_score": 0.92
}
```

### GET /health

Health check endpoint.

Response:
```json
{
  "status": "healthy"
}
```

## Model Information

The backend uses two main ML models:

1. Location Predictor (XGBoost)
   - Predicts optimal latitude and longitude based on user state

2. Characteristic Predictor (Random Forest)
   - Predicts optimal geographical characteristics for wellbeing

Both models are currently using mock predictions. In a production environment, they would be trained on real data combining user wellbeing metrics with geographical and environmental data.

## Copernicus Data Integration

The service integrates with Copernicus satellite data services:
- Climate Change Service (C3S)
- Atmosphere Monitoring Service (CAMS)

Currently using mock data for development. In production, real API calls would be made to fetch actual satellite data.

## Error Handling

The service includes robust error handling:
- Fallback data when Copernicus API is unavailable
- Input validation for all endpoints
- Proper error responses with meaningful messages

## Future Improvements

1. Implement actual ML model training
2. Add real Copernicus API integration
3. Add more geographical characteristics
4. Implement caching for frequently accessed locations
5. Add user feedback mechanism to improve predictions 