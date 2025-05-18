import os
from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_django.settings')

app = Celery('backend_django')

# Load task modules from all registered Django app configs
app.config_from_object('django.conf:settings', namespace='CELERY')

# Configure periodic tasks
app.conf.beat_schedule = {
    'update-health-indices': {
        'task': 'api.tasks.update_health_indices',
        'schedule': crontab(minute='*/30'),  # Run every 30 minutes
    },
    'train-health-model': {
        'task': 'api.tasks.train_health_index_model',
        'schedule': crontab(hour='*/24'),  # Run daily
    },
    'cleanup-old-indices': {
        'task': 'api.tasks.cleanup_old_indices',
        'schedule': crontab(hour=0, minute=0),  # Run at midnight
    },
}

# Auto-discover tasks in all installed apps
app.autodiscover_tasks() 