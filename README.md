# Hussain Medical Store — Smart Complaint Management System

A full MERN stack (MongoDB, Express.js, React.js, Node.js) complaint management
system, matching the workflow:

- Single common login page for both **User/Student** and **Admin**
- User registration → `Status = PENDING` → waits for admin approval
- Admin approves / rejects / activates / deactivates users, manages roles
- Approved users log in, submit complaints, and track status
- Admin views all complaints, searches/filters, views details, and updates status
  (`PENDING` → `IN PROGRESS` → `RESOLVED` / `REJECTED`)
- JWT-based authentication, role-based access control, protected routes

## Project Structure

```
hussain-medical-store/
├── backend/            Node.js + Express.js + MongoDB (Mongoose) API
│   ├── config/db.js
│   ├── models/          User.js, Complaint.js
│   ├── middleware/auth.js
│   ├── controllers/      authController.js, adminController.js, complaintController.js
│   ├── routes/            authRoutes.js, adminRoutes.js, complaintRoutes.js
│   ├── server.js
│   └── .env.example
└── frontend/            React.js (React Router + Context API + Axios)
    ├── src/
    │   ├── pages/          Login, Register, UserDashboard, SubmitComplaint,
    │   │                    TrackStatus, AdminDashboard, ManageUsers, ManageComplaints
    │   ├── components/     Navbar, PrivateRoute
    │   ├── context/        AuthContext.js
    │   └── api/axios.js
    └── .env.example
```

## 1. Prerequisites

- Node.js (v18+ recommended)
- MongoDB running locally, or a MongoDB Atlas connection string

## 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET, and the initial admin credentials
npm run dev
```

The server auto-creates **one initial admin account** on first run, using the
`ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` values from `.env` (only if no
admin exists yet). Use those credentials to log in as admin the first time.

API runs at `http://localhost:5000`.

## 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# edit .env if your backend runs on a different URL
npm start
```

App runs at `http://localhost:3000`.

## 4. Using the App

1. Register a new account at `/register` → account is created with `Status = PENDING`.
2. Log in as the seeded admin (from backend `.env`) at `/login`.
3. Go to **Manage Users** → approve the pending account.
4. Log out, log back in as the approved user → lands on the **User Dashboard**.
5. Submit a complaint, then track its status on **Track Status**.
6. As admin, go to **Manage Complaints** to view details and update status.

## Notes

- Passwords are hashed with `bcryptjs`.
- Auth uses JWT (`jsonwebtoken`), sent as `Authorization: Bearer <token>`.
- All admin routes are protected by both `protect` (valid, active user) and
  `authorize("admin")` (role check) middleware.
- Deactivated/pending/rejected users are blocked at login **and** on every
  subsequent request, so access is revoked immediately if an admin deactivates
  an account mid-session.
