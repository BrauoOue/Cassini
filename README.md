# Cassini Hackathon
## Team SatPulse's Solution

Database postgresql \
Backend springboot\
Frontend react

In the same location as the .env\
create .env.local\
and put this\
VITE_API_SPRING_URL=http://localhost:8080\
VITE_API_DJANGO_URL=http://localhost:8000\

When running this app in docker\
U need to change inside backend_django/settings.py\
line 92 to "'HOST': 'db', # todo change to db when run with docker"\
line 93 to "'PORT': '5432',"\