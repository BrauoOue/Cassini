from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    LocationViewSet,
    UserVisitViewSet,
    UserFeedbackViewSet,
    health_check
)

router = DefaultRouter()
router.register(r'locations', LocationViewSet, basename='location')
router.register(r'visits', UserVisitViewSet, basename='visit')
router.register(r'feedback', UserFeedbackViewSet, basename='feedback')

urlpatterns = [
    path('', include(router.urls)),
    path('health/', health_check, name='health-check'),
]