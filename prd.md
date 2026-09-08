I want you to help me build a complete full-stack web application called:

EMPLOYEE MANAGEMENT SYSTEM

I am going to provide you with:
1. A YouTube video reference
2. Screenshots captured from that video
3. The project requirements below

You must study the provided reference material and use it as the functional/UI reference for this project.

IMPORTANT:
The YouTube video and screenshots are a REFERENCE for functionality, workflow, page structure and UI layout.

Do NOT copy the original project's code, branding, exact colors, assets or implementation.

We are going to build our OWN implementation from scratch.

====================================================
PROJECT NAME
====================================================

Employee Management System

The project should NOT be described as only an Employee Leave Management System.

Leave management is only ONE module.

The complete system includes:

- Employee Management
- Department Management
- Leave Management
- Attendance Management
- Payroll Management
- Payslips
- Announcements
- Admin Dashboard
- Employee Dashboard
- Authentication
- Role-based authorization

====================================================
TECHNOLOGY STACK
====================================================

BACKEND:

Python
Django
Django REST Framework
JWT Authentication
MySQL

FRONTEND:

React
JavaScript
HTML / JSX
CSS
React Router
Axios

WEB SERVER:

Nginx

VERSION CONTROL:

Git
GitHub

CONTAINERIZATION:

Docker
Docker Compose

IMPORTANT:
Dockerization must be done AFTER the application is completed and working locally.

Do NOT start by Dockerizing the application.

====================================================
REFERENCE VIDEO AND SCREENSHOTS
====================================================

I will provide the YouTube URL and screenshots separately in this chat.

Use them to understand:

- overall UI structure
- navigation
- page layout
- dashboard structure
- employee management
- department management
- leave management
- payroll
- attendance
- announcements
- employee dashboard
- employee leave history
- payslip
- attendance workflow
- admin workflow
- employee workflow

Do not assume that something exists merely because it is common in an HR application.

If a feature is not shown in the reference material or explicitly specified below, treat it as an optional enhancement rather than silently adding it.

====================================================
IMPORTANT UI REQUIREMENT
====================================================

The overall UI should be INSPIRED BY the reference screenshots.

Keep the same general usability and organization where appropriate:

- professional navigation
- dashboard layout
- cards
- tables
- forms
- sidebar/navigation
- employee management screens
- admin screens
- employee screens
- status indicators
- action buttons
- confirmation dialogs

However:

DO NOT copy the exact visual design.

Use a DIFFERENT professional color combination.

The reference UI should be recognizable as the inspiration, but our application should have its own identity.

Choose a modern professional color palette suitable for an employee/HR management application.

Use the same palette consistently throughout:

- navbar
- sidebar
- buttons
- dashboard cards
- tables
- status badges
- forms
- links
- alerts
- headings
- footer

Do not randomly use colors on different pages.

====================================================
USER ROLES
====================================================

There are two primary roles:

ADMIN

EMPLOYEE

The UI, navigation and permissions must be different for these roles.

An Employee must never be able to access Admin functionality simply by entering an Admin URL manually.

Authorization must be enforced by the Django backend.

Frontend route protection alone is NOT sufficient.

====================================================
PUBLIC PAGES
====================================================

Create:

1. Home
2. About Us
3. Contact Us
4. Login
5. Employee Registration

The Home page should introduce the Employee Management System and its major modules.

====================================================
EMPLOYEE REGISTRATION
====================================================

Employees can register.

Registration should contain appropriate information such as:

- username
- email
- first name
- last name
- department
- salary where appropriate
- date of birth
- experience
- password
- password confirmation
- phone/contact information

New employee registrations must initially have:

PENDING status.

Admin must approve the employee before the employee gets normal system access.

Admin-created employees can be created directly as approved.

====================================================
ADMIN DASHBOARD
====================================================

Create an Admin Dashboard similar in concept to the reference.

The dashboard should contain live database-driven statistics such as:

- Total Employees
- Employees on Leave Today
- Total Departments
- Pending Employee Approvals
- Pending Leave Approvals
- Present Today
- Approved Leaves
- Pending Payrolls
- Total Announcements

Do NOT hard-code these values.

Every value must be calculated from the actual database.

The dashboard should update when relevant data changes.

For example:

Employee clocks in
→ Present Today changes.

Admin approves leave
→ Pending Leave decreases.
→ Approved Leave increases.

Employee goes on approved leave today
→ Employees on Leave Today changes.

====================================================
EMPLOYEE MANAGEMENT
====================================================

Admin must be able to:

- view employees
- add employees
- edit employees
- delete employees
- approve employee registrations
- reject employee registrations

Employee information should include appropriate fields such as:

- employee ID
- username
- name
- email
- phone
- department
- salary
- experience
- date of birth
- joining date
- status

Provide appropriate search/filter functionality where useful.

Use confirmation before destructive actions such as deletion.

====================================================
DEPARTMENT MANAGEMENT
====================================================

Admin can:

- view departments
- add departments
- edit departments
- delete departments

Department should contain:

- name
- description
- created date

Employees should have a proper relationship with departments.

====================================================
LEAVE MANAGEMENT
====================================================

Employee can apply for leave.

Leave request contains:

- employee
- start date
- end date
- reason
- status
- created date
- reviewed date

Statuses:

PENDING
APPROVED
REJECTED

Optional:
CANCELLED

Workflow:

Employee
→ Apply Leave
→ PENDING
→ Admin reviews
→ APPROVED or REJECTED

Admin can:

- view requests
- approve requests
- reject requests

Employee can see:

- pending requests
- approved requests
- rejected requests
- complete leave history

Rejected requests must remain in the history.

Validation must prevent:

- start date after end date
- invalid dates
- inappropriate overlapping requests

====================================================
ATTENDANCE
====================================================

Employee must be able to:

- Clock In
- Clock Out
- View attendance history

Normal employee rules:

Employee can clock in only for today's date.

Employee cannot clock in twice on the same day.

Employee cannot clock out before clocking in.

Employee cannot clock out twice on the same day.

Employee cannot manually create attendance for arbitrary past/future dates through the normal UI.

Admin can:

- view attendance
- manually create/correct attendance where required

Attendance should contain:

- employee
- date
- clock in
- clock out
- status where required

====================================================
ANNOUNCEMENTS
====================================================

Admin can:

- create announcement
- view announcements
- delete announcements

Announcement should contain:

- title
- content
- announcement date
- created date

Employees can view announcements.

Announcements should be visible from the Employee side where appropriate.

====================================================
PAYROLL
====================================================

Implement payroll as an internal HR workflow.

There is NO real bank/payment integration.

"Process Payment" means changing the payroll status inside the system.

Admin can:

- create payroll
- select employee
- set pay period
- set salary
- view payroll
- process payroll

Payroll can contain:

- employee
- pay period start
- pay period end
- basic salary
- allowances
- deductions
- net salary
- status
- processed date

Statuses:

PENDING
PAID

====================================================
PAYSLIPS
====================================================

Employees can view their payslips.

Employees can download a payslip PDF.

The PDF should contain:

- company name
- company address
- employee name
- employee ID
- department
- pay period
- salary
- allowances
- deductions
- net salary
- payment status
- generated date

The payslip should look professional.

====================================================
EMPLOYEE DASHBOARD
====================================================

Employee dashboard should contain information relevant only to that employee.

Include:

- employee information
- pending leave requests
- approved leaves
- rejected leaves where useful
- attendance this month
- announcements
- payroll/payslip information

Never expose another employee's private information.

====================================================
AUTHENTICATION
====================================================

Use JWT authentication.

Use:

- Access Token
- Refresh Token
- Token refresh
- Protected API endpoints
- Role-based authorization

Recommended implementation:

Django REST Framework
+
Simple JWT

The React frontend communicates with Django only through REST APIs.

Do not use Django templates as the main frontend.

====================================================
BACKEND
====================================================

Use Django + Django REST Framework.

Create a clean modular architecture.

Suggested Django apps:

accounts
employees
departments
leaves
attendance
announcements
payroll
dashboard

You may adjust this structure if there is a strong technical reason.

Keep responsibilities separated.

Do not create one huge views.py or one huge application containing everything.

====================================================
DATABASE
====================================================

Use MySQL.

Expected main entities:

User
EmployeeProfile
Department
LeaveRequest
Attendance
Announcement
Payroll

Use proper Django relationships:

User
→ EmployeeProfile

Department
→ EmployeeProfile

EmployeeProfile
→ LeaveRequest

EmployeeProfile
→ Attendance

EmployeeProfile
→ Payroll

Announcement
→ created by Admin

Use:

ForeignKey
OneToOneField
choices
constraints
indexes where useful
timestamps

Do not duplicate authentication information unnecessarily.

====================================================
REST API
====================================================

Create REST APIs for all application functionality.

Authentication:

POST login
POST refresh
POST register

Employees:

GET employees
POST employee
GET employee/{id}
PATCH employee/{id}
DELETE employee/{id}
approve/reject employee

Departments:

GET departments
POST department
GET department/{id}
PATCH department/{id}
DELETE department/{id}

Leaves:

GET leaves
POST leave
approve leave
reject leave

Attendance:

GET attendance
POST clock-in
POST clock-out

Announcements:

GET announcements
POST announcement
DELETE announcement/{id}

Payroll:

GET payroll
POST payroll
process payroll

Dashboard:

GET admin dashboard statistics
GET employee dashboard statistics

Use serializers and permission classes properly.

====================================================
SECURITY
====================================================

The backend must enforce permissions.

Examples:

Admin-only endpoints
Employee-only endpoints
Authenticated endpoints

Never trust a role sent by React.

The backend must determine the authenticated user's role.

Passwords must be securely hashed.

Secrets must use environment variables.

Never commit secrets to GitHub.

====================================================
REACT
====================================================

Use React for the complete frontend.

Use:

React Router
Axios
Reusable components

Suggested structure:

frontend/

src/

components/
pages/
layouts/
services/
hooks/
context/
routes/
utils/
assets/

Create reusable components for:

- Navbar
- Sidebar
- Dashboard cards
- Tables
- Forms
- Buttons
- Status badges
- Alerts
- Loading indicators
- Confirmation dialogs

====================================================
REACT ROUTES
====================================================

Public:

/
 /about
 /contact
 /login
 /register

Admin:

/admin/dashboard
/admin/employees
/admin/departments
/admin/leaves
/admin/attendance
/admin/announcements
/admin/payroll

Employee:

/employee/dashboard
/employee/profile
/employee/leaves
/employee/attendance
/employee/announcements
/employee/payslips

Protect routes appropriately.

====================================================
UI/UX
====================================================

Create a modern professional HR application.

Reference screenshots should influence:

- page hierarchy
- navigation
- dashboard organization
- table layouts
- forms
- workflow

But do not copy:

- exact colors
- branding
- logos
- images
- exact text
- original code

Use a new color identity.

The interface must be:

- responsive
- clean
- consistent
- professional
- easy to navigate

Include:

- loading states
- empty states
- error states
- success messages
- validation messages
- confirmation dialogs

====================================================
NGINX
====================================================

Nginx will be used in the final architecture.

Expected architecture:

Browser
   |
   v
 Nginx
   |
   +---- React frontend
   |
   +---- /api/
            |
            v
       Django REST API
            |
            v
          MySQL

Nginx configuration will be completed after the main application is working.

====================================================
DOCKER
====================================================

Docker is a SECOND PHASE.

Do not begin the project by Dockerizing it.

First make the application work locally.

After the complete application is tested:

Create:

Dockerfile(s)
docker-compose.yml
.dockerignore
Nginx Docker configuration

Expected services may include:

backend
frontend
mysql
nginx

Use Docker volumes for persistent database storage.

Use environment variables.

The Dockerized application must reproduce the working local application.

====================================================
GIT
====================================================

Use Git throughout development.

Make logical commits.

Examples:

chore: initialize project

feat: configure django backend

feat: configure mysql database

feat: implement employee models

feat: implement jwt authentication

feat: implement employee management

feat: implement leave management

feat: implement attendance

feat: implement payroll

feat: create react frontend

feat: connect frontend to api

feat: add dashboards

chore: add nginx configuration

chore: dockerize application

docs: update readme

Do not create one massive commit at the end.

====================================================
GITHUB
====================================================

The completed project will be pushed to GitHub.

Do not commit:

.env
passwords
database credentials
JWT secrets
node_modules
Python virtual environment
temporary files

Create:

.env.example

Create a professional README.

====================================================
PROJECT STRUCTURE
====================================================

The final project should approximately look like:

employee-management-system/

    backend/

        manage.py

        config/

        apps/

            accounts/

            employees/

            departments/

            leaves/

            attendance/

            announcements/

            payroll/

            dashboard/

        requirements.txt

        .env.example


    frontend/

        src/

            components/

            pages/

            layouts/

            services/

            hooks/

            context/

            routes/

            utils/

            assets/

        package.json

        .env.example


    nginx/

        nginx.conf


    docker/

        Docker-related configuration


    .gitignore

    README.md


====================================================
DEVELOPMENT PHASES
====================================================

Follow these phases.

PHASE 1
Project initialization.

PHASE 2
Django backend setup.

PHASE 3
MySQL configuration.

PHASE 4
Database models and migrations.

PHASE 5
Django REST Framework APIs.

PHASE 6
JWT authentication.

PHASE 7
Permissions and authorization.

PHASE 8
Backend testing.

PHASE 9
React frontend.

PHASE 10
Authentication integration.

PHASE 11
Admin UI.

PHASE 12
Employee UI.

PHASE 13
Leave management.

PHASE 14
Attendance.

PHASE 15
Announcements.

PHASE 16
Payroll.

PHASE 17
Payslip PDF.

PHASE 18
Dashboards.

PHASE 19
Complete integration testing.

PHASE 20
Nginx.

PHASE 21
Dockerization.

PHASE 22
Git/GitHub finalization.

====================================================
VERY IMPORTANT COPILOT BEHAVIOR
====================================================

Do NOT generate the entire project in one huge response.

Do NOT immediately create hundreds of files.

First inspect the current workspace.

Then explain the proposed architecture.

Then implement one logical phase at a time.

Before modifying important files:

- explain what will change
- make the change
- check for obvious errors
- explain how I can run/test it

If something is ambiguous, ask me rather than silently making a major architectural decision.

Do not delete existing files without asking.

Do not replace the requested technology stack.

Do not replace MySQL with SQLite.

Do not replace React with Django templates.

Do not replace JWT with session authentication.

Do not start Docker before the application is complete.

====================================================
REFERENCE MATERIAL ANALYSIS
====================================================

After I provide the YouTube URL and screenshots:

First analyze them.

Give me:

1. Features visible in the reference
2. Admin workflow
3. Employee workflow
4. Page/navigation structure
5. Dashboard components
6. Leave workflow
7. Attendance workflow
8. Payroll workflow
9. Announcement workflow
10. UI elements visible
11. Any functionality that is unclear from the reference

Clearly distinguish:

A. Things directly visible/shown in the reference
B. Requirements explicitly specified in this prompt
C. Things that you recommend adding

Do not silently mix these categories.

====================================================
STARTING POINT
====================================================

Do NOT start coding immediately.

First inspect my current VS Code workspace.

Then analyze the reference material I provide.

Then show me the proposed architecture and project structure.

Wait for my confirmation before beginning the first implementation phase.

The final goal is a complete, professional Employee Management System that I can demonstrate as a Python Full Stack project and later Dockerize and publish to GitHub.