# Employee Management System

A full-stack employee operations platform inspired by the provided workflow references and built from scratch.

## Current foundation

- `frontend/`: React + Vite shell with responsive public pages, admin-style dashboard, people directory, and module placeholders.
- `backend/`: Django + Django REST Framework configuration with a public health endpoint.
- SQLite is used by default for local development; MySQL configuration is environment-driven for the application phase.

## Run locally

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

### Backend

```powershell
cd backend
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The frontend is available at `http://localhost:5173` and the API health check at `http://127.0.0.1:8000/api/health/`.
