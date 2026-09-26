# Employee Management System

## Project overview

I am building a full-stack Employee Management System to manage employees and common HR tasks in one place. The system will have separate areas for administrators and employees.

## Main features

- Employee and department management
- Leave requests and approvals
- Employee attendance
- Announcements
- Payroll records and payslips
- Separate admin and employee dashboards
- Login, registration, and role-based access

## Technology

- **Backend:** Python, Django, Django REST Framework
- **Database:** MySQL
- **Authentication:** JWT
- **Frontend:** React, JavaScript, React Router, Axios, CSS
- **Version control:** Git and GitHub
- **Later, after the app works locally:** Nginx, Docker, and Docker Compose

The React application will communicate with Django through REST APIs. I will not use Django templates for the main frontend.

## Users and access

There are two roles:

- **Admin:** manages employees, departments, leave requests, attendance, announcements, and payroll.
- **Employee:** views their own information, submits leave requests, records attendance, reads announcements, and views payslips.

The backend must check the user's role and permissions for every protected API. Hiding a page in React is not enough to protect admin features.

New employee registrations will have a **Pending** status. An admin must approve them before they can use the employee features. Admin-created employees can be approved when they are added.

## Pages and workflows

### Public pages

- Home
- About Us
- Contact Us
- Login
- Employee Registration

The home page will introduce the system and its main features.

### Admin area

Admins can:

- View and manage employees
- Approve or reject new employee registrations
- Create and manage departments
- Review and approve or reject leave requests
- View and correct attendance records when needed
- Create and delete announcements
- Create payroll records and mark them as paid
- View dashboard statistics

### Employee area

Employees can:

- View their own profile and dashboard
- Submit leave requests and view their leave history
- Clock in and out, then view their attendance history
- Read announcements
- View and download their payslips

Employees must only be able to see their own private information.

## Module requirements

### Employees and departments

Employee records will include information such as name, email, phone, department, salary, experience, date of birth, joining date, and status.

Departments will have a name, description, and creation date. Each employee can be linked to a department.

Admins can search and filter employee records. The system should ask for confirmation before deleting records.

### Leave management

Employees can submit a leave request with a start date, end date, and reason. Each request has a status: **Pending**, **Approved**, or **Rejected**.

The system must reject invalid date ranges and overlapping requests where appropriate. Rejected requests stay visible in the employee's leave history.

### Attendance

Employees can clock in and clock out for the current day. They cannot clock in twice, clock out before clocking in, or clock out twice on the same day. Employees cannot choose a past or future date for normal attendance actions.

Admins can view attendance and make corrections when needed.

### Announcements

Admins can create and delete announcements. Employees can view them. Each announcement has a title, content, announcement date, and creation date.

### Payroll and payslips

Payroll is an internal record-keeping workflow; it does not send money or connect to a bank. Admins can create payroll records and mark them as paid.

A payroll record includes the employee, pay period, basic salary, allowances, deductions, net salary, status, and processed date.

Employees can view their own payslips and download them as PDFs. A payslip should include the company and employee details, pay period, salary amounts, payment status, and generated date.

### Dashboards

The admin dashboard will show statistics calculated from the database, including employee totals, pending approvals, attendance today, leave totals, pending payroll, departments, and announcements.

The employee dashboard will show information for the signed-in employee, such as their leave requests, attendance, announcements, and payroll records. Dashboard values must not be hard-coded.

## API and security

I will create REST API endpoints for authentication and each application module. Django REST Framework serializers and permission classes will validate requests and control access.

Authentication will use JWT access and refresh tokens. Passwords will be handled by Django's secure password system. Secrets and database credentials will be stored in environment variables and excluded from Git.

## Design

I will create a clean, responsive interface with a consistent professional color palette of my own. The reference material will guide the general page structure and workflows, not the exact colors, branding, assets, or code.

The interface should include clear navigation, forms, tables, status labels, loading and empty states, error messages, success messages, and confirmation prompts.

## Development order

I will build and test the application locally before working on Docker.

1. Define the purpose, users, main features, and workflows for my application, and check what is already in the workspace.
2. Agree on the application structure and identify any unclear requirements.
3. Set up Git and create the initial project structure.
4. Set up Django, Django REST Framework, and the MySQL connection.
5. Create the database models and run migrations.
6. Build and test the REST APIs.
7. Add JWT authentication, roles, and backend permissions.
8. Test the backend APIs and important access rules.
9. Set up the React application and shared UI components.
10. Connect React login and registration to the backend.
11. Build the admin pages and employee-management workflows.
12. Build the employee pages and profile views.
13. Add leave management and test the approval workflow.
14. Add attendance and test clock-in and clock-out rules.
15. Add announcements.
16. Add payroll and payslip PDF downloads.
17. Add database-driven admin and employee dashboards.
18. Test the complete application from frontend to database.
19. Add Nginx configuration.
20. Add Dockerfiles and Docker Compose, then verify the containerized app.
21. Update the README and `.env.example`, check `.gitignore`, and push the finished work to GitHub.

I will make small, logical Git commits as I work rather than waiting until the end. I will not commit passwords, environment files, database credentials, or generated dependency folders.

## Project structure

The structure may change as the project develops, but I expect it to be similar to:

```text
employee-management-system/
├── backend/
│   ├── apps/
│   │   ├── accounts/
│   │   ├── employees/
│   │   ├── departments/
│   │   ├── leaves/
│   │   ├── attendance/
│   │   ├── announcements/
│   │   ├── payroll/
│   │   └── dashboard/
│   ├── config/
│   ├── Dockerfile
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── index.html
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
├── nginx/
│   └── nginx.conf
├── docker-compose.yml
├── .dockerignore
├── .gitignore
└── README.md
```

I will work one stage at a time, check that each part runs, and avoid creating the whole application in one step.