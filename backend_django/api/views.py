from django.shortcuts import render
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework import viewsets, status
from django.utils import timezone
from datetime import timedelta
from .serializers import (
    UserStateInputSerializer,
    LocationPredictionSerializer,
    LocationSerializer,
    LocationSelectionSerializer,
    LocationFeedbackInputSerializer,
    LocationFeedbackSerializer,
    UserVisitSerializer,
    UserFeedbackSerializer
)
from .models import (
    Location, LocationCharacteristics, UserState,
    LocationSelection, LocationFeedback, SuggestedLocation,
    UserVisit, UserFeedback
)
from .services.prediction import WellbeingPredictor
from .services.location_service import LocationService
from .services.copernicus_service import CopernicusService
from rest_framework.permissions import IsAuthenticated

# Initialize services
predictor = WellbeingPredictor()
location_service = LocationService()
copernicus_service = CopernicusService()

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

@api_view(['POST'])
def predict_location(request):
    """
    Predict optimal location based on user's mental and physical state
    Also stores the user state and suggestions for future model training
    """
    serializer = UserStateInputSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Save user state
        user_state = UserState.objects.create(
            user=request.user,
            **{k: v for k, v in serializer.validated_data.items() 
               if k not in ['current_latitude', 'current_longitude', 'search_radius_km']}
        )
        
        # Get prediction with location matching
        prediction = predictor.predict(
            mental_state=serializer.validated_data,
            physical_state=serializer.validated_data,
            user_latitude=serializer.validated_data.get('current_latitude'),
            user_longitude=serializer.validated_data.get('current_longitude'),
            radius_km=serializer.validated_data.get('search_radius_km', 20.0)
        )
        
        # Store suggested locations
        if 'similar_locations' in prediction:
            location_selection = LocationSelection.objects.create(
                user=request.user,
                user_state=user_state,
                current_location_lat=serializer.validated_data.get('current_latitude'),
                current_location_lon=serializer.validated_data.get('current_longitude'),
                search_radius_km=serializer.validated_data.get('search_radius_km', 20.0)
            )
            
            # Store each suggested location
            for idx, loc_data in enumerate(prediction['similar_locations']):
                location = Location.objects.get(id=loc_data['id'])
                SuggestedLocation.objects.create(
                    selection=location_selection,
                    location=location,
                    similarity_score=loc_data['similarity_score'],
                    health_index_score=loc_data['health_index']['overall_health_index'],
                    combined_score=loc_data['combined_score'],
                    rank=idx + 1
                )
        
        # Serialize and return the prediction
        prediction_serializer = LocationPredictionSerializer(prediction)
        return Response(prediction_serializer.data)
    except Exception as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def select_location(request, location_id):
    """
    Record user's location selection from the suggestions
    """
    try:
        # Get the most recent selection for this user (within last hour)
        cutoff_time = timezone.now() - timedelta(hours=1)
        location_selection = LocationSelection.objects.filter(
            user=request.user,
            timestamp__gte=cutoff_time
        ).latest('timestamp')
        
        # Update the selection with the chosen location
        location = Location.objects.get(id=location_id)
        location_selection.location = location
        location_selection.save()
        
        serializer = LocationSelectionSerializer(location_selection)
        return Response(serializer.data)
    except (LocationSelection.DoesNotExist, Location.DoesNotExist) as e:
        return Response(
            {'error': 'Invalid selection or location not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def submit_feedback(request, selection_id):
    """
    Submit feedback for a location visit
    """
    serializer = LocationFeedbackInputSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        location_selection = LocationSelection.objects.get(
            id=selection_id,
            user=request.user
        )
        
        # Create feedback record
        feedback = LocationFeedback.objects.create(
            selection=location_selection,
            mood_impact=serializer.validated_data['mood_impact'],
            stress_impact=serializer.validated_data['stress_impact'],
            energy_impact=serializer.validated_data['energy_impact'],
            overall_satisfaction=serializer.validated_data['overall_satisfaction'],
            visit_duration=timedelta(
                minutes=serializer.validated_data.get('visit_duration_minutes', 0)
            ) if serializer.validated_data.get('visit_duration_minutes') else None,
            activities_performed=serializer.validated_data.get('activities_performed'),
            comments=serializer.validated_data.get('comments'),
            crowding_level=serializer.validated_data.get('crowding_level'),
            weather_conditions=copernicus_service.get_current_weather(
                location_selection.location.latitude,
                location_selection.location.longitude
            )
        )
        
        feedback_serializer = LocationFeedbackSerializer(feedback)
        return Response(feedback_serializer.data)
    except LocationSelection.DoesNotExist:
        return Response(
            {'error': 'Location selection not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def health_check(request):
    """
    Health check endpoint
    """
    return Response({'status': 'healthy'})

class UserVisitViewSet(viewsets.ModelViewSet):
    """
    API endpoints for managing user visits
    """
    serializer_class = UserVisitSerializer
    permission_classes = [IsAuthenticated]
    predictor = WellbeingPredictor()

    def get_queryset(self):
        return UserVisit.objects.filter(user=self.request.user)

    def create(self, request):
        """
        Record a new visit with user state
        """
        location_id = request.data.get('location_id')
        mental_state = request.data.get('mental_state', {})
        physical_state = request.data.get('physical_state', {})

        try:
            visit = self.predictor.log_visit(
                user_id=request.user.id,
                location_id=location_id,
                mental_state=mental_state,
                physical_state=physical_state
            )
            return Response(
                UserVisitSerializer(visit).data,
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def end_visit(self, request, pk=None):
        """
        End a visit and record its duration
        """
        visit = self.get_object()
        visit.duration = timezone.now() - visit.timestamp
        visit.save()
        return Response(UserVisitSerializer(visit).data)

    @action(detail=False, methods=['get'])
    def history(self, request):
        """
        Get user's visit history
        """
        days = int(request.query_params.get('days', 30))
        history = self.predictor.get_user_visit_history(
            user_id=request.user.id,
            days=days
        )
        return Response(history)

class UserFeedbackViewSet(viewsets.ModelViewSet):
    """
    API endpoints for managing user feedback
    """
    serializer_class = UserFeedbackSerializer
    permission_classes = [IsAuthenticated]
    predictor = WellbeingPredictor()

    def get_queryset(self):
        return UserFeedback.objects.filter(visit__user=self.request.user)

    def create(self, request):
        """
        Record feedback for a visit
        """
        visit_id = request.data.get('visit_id')
        feedback_data = {
            'mood_improvement': request.data.get('mood_improvement'),
            'stress_reduction': request.data.get('stress_reduction'),
            'energy_change': request.data.get('energy_change'),
            'overall_satisfaction': request.data.get('overall_satisfaction'),
            'comments': request.data.get('comments', '')
        }

        try:
            feedback = self.predictor.record_feedback(
                visit_id=visit_id,
                feedback_data=feedback_data
            )
            return Response(
                UserFeedbackSerializer(feedback).data,
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )