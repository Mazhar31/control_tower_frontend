# TAIGA Control Tower — AI Compliance Platform

TAIGA Control tower is a web-based AI compliance assessment platform. It allows organisations to submit their AI systems for gap analysis against major regulatory frameworks, view results on an executive dashboard, and manage users through an admin panel.

---

## Architecture

```
Frontend (React + Vite)  ──►  Backend (FastAPI)  ──►  Leash API (AWS Lambda)
                                     │
                               SQLite Database
```

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Frontend     | React 19, Vite, Tailwind CSS, Axios |
| Backend      | FastAPI, SQLAlchemy, SQLite         |
| Auth         | JWT (python-jose), bcrypt           |
| External API | The Leash (HAIG AWS Lambda)         |
| Deployment   | Railway / Render                    |

---

## Project Structure

```
├── backend/
│   ├── routes/
│   │   ├── auth.py          # Login, signup, change password
│   │   ├── assess.py        # Assessment submission & history
│   │   └── admin.py         # Admin user management
│   ├── main.py              # App entry point, CORS, admin seed
│   ├── models.py            # SQLAlchemy models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # JWT & password utilities
│   ├── leash_service.py     # Leash API client
│   ├── database.py          # DB engine & session
│   └── .env                 # Environment variables (not committed)
│
└── src/
    ├── api/client.js         # Axios instance
    ├── context/AuthContext.jsx
    ├── components/
    │   ├── auth/             # Login, Signup
    │   ├── AdminPanel.jsx
    │   ├── IntakePage.jsx
    │   ├── Dashboard.jsx
    │   ├── AssessmentHistory.jsx
    │   └── ProfilePage.jsx
    └── data/mockData.js      # Default form values & mock response
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+

### Backend

```bash
cd backend
pip install -r requirements.txt
python seed_admin.py      # creates admin user on first run
uvicorn main:app --reload
```

### Frontend

```bash
npm install
npm run dev
```

---

## Environment Variables

### Backend — `backend/.env`

| Variable        | Description                                   | Default        |
| --------------- | --------------------------------------------- | -------------- |
| `LEASH_API_KEY` | API key for The Leash                         | —              |
| `LEASH_URL`     | Leash Lambda endpoint                         | AWS Lambda URL |
| `LEASH_TIMEOUT` | Request timeout in seconds                    | `900`          |
| `USE_MOCK`      | Return mock response instead of calling Leash | `false`        |

### Frontend — `.env`

| Variable            | Description                | Example                                         |
| ------------------- | -------------------------- | ----------------------------------------------- |
| `VITE_API_BASE_URL` | API base path              | `/api` (dev), `https://your-backend.com` (prod) |
| `VITE_BACKEND_URL`  | Backend URL for Vite proxy | `http://localhost:8000`                         |

---

## User Roles

| Role    | Access                                              |
| ------- | --------------------------------------------------- |
| `admin` | Admin panel — create & delete users                 |
| `user`  | Intake form, dashboard, assessment history, profile |

### Default Credentials

|                           | Email             | Password     |
| ------------------------- | ----------------- | ------------ |
| Admin                     | `admin@taiga.com` | `Admin@123`  |
| New users (admin-created) | —                 | `Qwerty@123` |

---

## API Endpoints

### Auth — `/auth`

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| POST   | `/auth/signup`          | Register a new user |
| POST   | `/auth/login`           | Login, returns JWT  |
| PUT    | `/auth/change-password` | Change own password |

### Assessment — `/assess`

| Method | Endpoint          | Description                             |
| ------ | ----------------- | --------------------------------------- |
| POST   | `/assess`         | Submit intake form, runs gap assessment |
| GET    | `/assess/history` | List user's past assessments            |
| GET    | `/assess/{id}`    | Fetch a specific assessment             |

### Admin — `/admin`

| Method | Endpoint            | Description                         |
| ------ | ------------------- | ----------------------------------- |
| GET    | `/admin/users`      | List all non-admin users            |
| POST   | `/admin/users`      | Create a user with default password |
| DELETE | `/admin/users/{id}` | Delete a user                       |

All endpoints except login/signup require `Authorization: Bearer <token>`.

---

## Assessment Flow

1. User fills the intake form (company, system description, industry, geography, data types, AIHCS response)
2. Frontend POSTs to `/assess` with form data
3. Backend calls The Leash API in 4 steps: `start` → `answer` (triage) → `audit` → `generate`
4. Frameworks sent to Leash are hardcoded: `EU AI Act`, `ISO 42001`, `HIPAA`, `NIST AI RMF`
5. Result is stored in SQLite and returned to the frontend
6. User is redirected to the dashboard showing compliance score, gap findings, and framework breakdown

---

## Session & Security

- Sessions use `sessionStorage` — cleared automatically when the browser tab is closed
- JWT tokens expire after **24 hours**
- Auto-logout after **30 minutes of inactivity**
- Expired tokens are detected on every protected route render
- Passwords are hashed with bcrypt

---

## Deployment

### Frontend (Render)

```bash
npm run build        # outputs to dist/
```

Set environment variable:

```
VITE_API_BASE_URL=https://your-backend-url.com
```

### Backend (Render)

```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

Set environment variables: `LEASH_API_KEY`, `USE_MOCK=false`

> The SQLite database file (`compliance.db`) is created automatically on first run. For production, consider migrating to PostgreSQL.
