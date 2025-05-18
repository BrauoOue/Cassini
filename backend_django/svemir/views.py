from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveAPIView, CreateAPIView, UpdateAPIView
from django.shortcuts import get_object_or_404
from .models import User, UserState, Location, Visit
from .serializers import (
    UserSerializer, UserStateSerializer, LocationSerializer,
    VisitSerializer, FeedbackSerializer
)
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from django.contrib.gis.db.models.functions import Distance


# POST /api/user/
class CreateUserView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


# POST /api/user-state/
class UserStateCreateView(CreateAPIView):
    queryset = UserState.objects.all()
    serializer_class = UserStateSerializer


# GET /api/locations/nearby/?lat=..&lon=..
class NearbyLocationsView(ListAPIView):
    serializer_class = LocationSerializer

    def get_queryset(self):
        lat = float(self.request.query_params.get("lat"))
        lon = float(self.request.query_params.get("lon"))
        user_location = Point(lon, lat, srid=4326)
        return Location.objects.annotate(
            distance=Distance("coordinates", user_location)
        ).filter(
            coordinates__distance_lte=(user_location, D(km=20))
        ).order_by("distance")


# GET /api/locations/<id>/
class LocationDetailView(RetrieveAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer


# POST /api/visit/
class VisitCreateView(CreateAPIView):
    queryset = Visit.objects.all()
    serializer_class = VisitSerializer


# PATCH /api/visit/<id>/feedback/
class VisitFeedbackUpdateView(UpdateAPIView):
    queryset = Visit.objects.all()
    serializer_class = FeedbackSerializer

    def get_object(self):
        return get_object_or_404(Visit, pk=self.kwargs["pk"])
