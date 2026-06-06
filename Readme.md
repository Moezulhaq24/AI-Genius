# AI-Genius: Secure AI SaaS Platform

A full-stack AI SaaS application demonstrating secure JWT Authentication, Role-Based Access Control (RBAC), and stateless session management.

## Tech Stack
- **Backend:** Python, FastAPI, SQLAlchemy, SQLite, bcrypt
- **Frontend:** Next.js (React), Tailwind CSS
- **Security:** JWT Access/Refresh Tokens, httpOnly Cookies, RBAC Middleware

## Demo Accounts
- **Admin:** admin@test.com / admin123
- **Premium:** premium@test.com / premium123
- **Free:** free@test.com / free123

## How to Run
1. **Backend:** `cd backend`, create `.env`, `pip install -r requirements.txt`, `uvicorn app.main:app --reload`
2. **Frontend:** `cd frontend`, `npm install`, `npm run dev`