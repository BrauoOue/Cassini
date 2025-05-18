# Cassini Hackathon - Team SatPulse Solution

This repository contains the full-stack solution developed by **Team SatPulse** for the Cassini Hackathon.

---

# Project Summary
Team SatPulse's solution leverages satellite data and advanced AI to improve healthcare outcomes. The backend uses Django and PostgreSQL to manage data, while the React frontend provides a smooth and interactive user experience. This setup enables real-time analysis and visualization of medical and environmental data to support better healthcare decisions during the Cassini Hackathon.

---

## Tech Stack

- **Database:** PostgreSQL  
- **Backend:** Django  
- **Frontend:** React, Framer Motion, Leaflet.js  

---

## Setup Instructions

### 1. Environment Variables  
In the root directory (same location as your `.env` file), create a file named `.env.local` and add the following variables:
VITE_API_SPRING_URL=http://localhost:8080
VITE_API_DJANGO_URL=http://localhost:8000

### 2. Running the Frontend

To start the frontend app, run these commands:

cd frontend
npm install
npm run dev

### 3. Running with Docker

Open backend_django/settings.py and modify the database host and port as follows:

'HOST': 'db', 
'PORT': '5432',

