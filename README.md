# Buckner Conference Room Reservation System

## Code Repository
This project is hosted on GitHub: [https://github.com/BucknerHeavyLiftCranes/ConRoom]

Clone the repository via HTTPS or SSH
For HTTPS:
1. Click the green code button on the Github webpage and copy the web URL 
2. In your preferred IDE, clone the Git repository and save it to a safe location you can access and remember.

## Building and Running the System

### Prerequisites:
- Node.js v18+
- SQL Server (local or remote instance)
- Docker (for containerized deployment)

### Environment Variables:
Create a `.env` file in `/backend` needed for:
- Database connection strings
- Microsoft SSO credentials

---

## High-Level Module Structure

### Programming Languages
- **JavaScript** — Frontend (React) and Backend (Node.js + Express)
- **SQL** — Database queries and schema (Microsoft SQL Server)

### Architecture Overview
- **Frontend**: React and CSS
- **Backend**: Node.js with Express.js
- **Database**: Microsoft SQL Server
- **Authentication**: Microsoft SSO (Azure AD)
- **Integration**: Microsoft Graph API for syncing Outlook meetings

### Code Structure

#### **Frontend (React)**
- `/src/components` – UI elements (e.g. room schedule display)
- `/src/pages` – Main screen views
- `/src/services` – API calls to the backend

#### **Backend (Node.js + Express)**
- `backend/api/controllers` – Logic for handling API requests
- `backend/api/middleware` – Logic for handling errors and access tokens
- `backend/api/models` – SQL query logic for interacting with tables
- `backend/api/routes` – Express route definitions


#### **Database (SQL Server)**
- `backend/database` – Sets up database and tables
- `backend/config` – Sets up the DB connection
- Tables: `Admins`, `Reservations`, `Rooms`
- Logic lives in backend `backend/api/models` modules

### Module Relationships
- React **components** → use **services** to talk to backend via REST APIs
- Backend **routes** → delegate logic to **controllers**
- Controllers → query/update SQL Server using **models**
- Backend middleware uses **auth** to verify user identity via Microsoft SSO
- Outlook calendar syncs handled via **Graph API logic** in backend

---

## License
This project is for educational purposes as part of COMP 523 at UNC Chapel Hill.

---

## Contributors
- [Tobenna Okoli]
- [Prithvi Adiga]
- [Luis Fajardo]
- [Michelle Kieu]

