from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .services.health_index_service import HealthIndexService

@shared_task
def update_health_indices():
    """
    Periodic task to update health indices for all locations
    """
    service = HealthIndexService()
    service.update_health_indices()

@shared_task
def train_health_index_model():
    """
    Periodic task to train the health index prediction model
    """
    service = HealthIndexService()
    service.predictor.train_model()

@shared_task
def cleanup_old_indices():
    """
    Clean up old health index records
    Keep only the last 30 days of historical data
    """
    from .models import HealthIndex
    
    cutoff_date = timezone.now() - timedelta(days=30)
    HealthIndex.objects.filter(timestamp__lt=cutoff_date).delete() 