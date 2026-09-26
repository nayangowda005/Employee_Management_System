# Employee Management System

A full-stack application for managing employee information and common HR tasks. The project uses React with Vite for the frontend and Django REST Framework for the backend.

## Current project foundation

- **Frontend:** React and Vite with public pages, a dashboard layout, a people directory, and module placeholders.
- **Backend:** Django and Django REST Framework with a public health-check endpoint.
- **Database:** SQLite is the default for local development. MySQL configuration is environment-driven.
- **Containers:** Docker Compose is used to run the application services.

Some HR features are still under development. The pages and API may not yet provide the complete employee-management workflows.

## Requirements

For local development, install:

- Python
- Node.js and npm

For Docker, install Docker Desktop and make sure it is running.

## Run locally

Run the frontend and backend in separate PowerShell terminals.

### Start the frontend

```powershell
cd frontend
npm install
npm run dev
```

Open the frontend at:

- http://localhost:5173

### Start the backend

```powershell
cd backend
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The backend runs at:

- http://127.0.0.1:8000
- Health check: http://127.0.0.1:8000/api/health/

Keep both terminals running while using the application.

## Run with Docker Compose

Make sure Docker Desktop is running. In PowerShell, go to the project root—the folder containing `docker-compose.yml`.

### Start the application

```powershell
docker compose up --build
```

To start it in the background:

```powershell
docker compose up --build -d
```

Open the application at:

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8000
- **Backend health check:** http://localhost:8000/api/health/

These addresses depend on the port mappings in `docker-compose.yml`. If your Compose file uses different ports, use those instead.

### View logs

```powershell
docker compose logs -f
```

Press `Ctrl+C` to exit the log view. This does not stop containers started in the background.

### Stop the application

```powershell
docker compose down
```

To also delete Compose volumes, which may contain database data:

```powershell
docker compose down -v
```

## Project structure

```text
employee-management-system/
├── backend/          # Django project and REST API
├── frontend/         # React application built with Vite
├── docker-compose.yml
└── README.md
```

The structure may grow as more application features are added.

## Development goals

The application is being developed in stages:

1. Set up and verify the project locally and with Docker.
2. Build the database models and REST API.
3. Add authentication, user roles, and backend permissions.
4. Build and connect the React pages.
5. Implement employee management, leave, attendance, announcements, and payroll.
6. Add dashboards using database data and test the main workflows.
7. Improve deployment configuration as the application develops.

## Security

Protected features must be checked by the backend, not only hidden in the frontend. Employees should only be able to access their own private information.

Do not commit `.env` files, passwords, secret keys, or database credentials to Git. Use environment variables for sensitive settings.