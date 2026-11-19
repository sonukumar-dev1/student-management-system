# Student Management System

A full-stack Student Management System built using React.js, Node.js, Express.js, and MongoDB. The application provides student registration, authentication, profile management, and administrative control over student records.

## Features

### Student
- Student registration and login
- View personal profile
- Update name, phone number, and date of birth
- View calculated age
- Secure logout

### Admin
- Admin login
- View all registered students
- View individual student details
- Edit student information
- Delete student records
- Secure logout

### Security
- JWT-based authentication
- Password hashing using bcrypt
- Role-based authorization
- Protected API routes
- Token blacklisting on logout
- Input validation

## Tech Stack

**Frontend**
- React.js
- Vite
- React Router
- Axios
- CSS

**Backend**
- Node.js
- Express.js
- Mongoose
- MongoDB
- JWT
- bcryptjs
- express-validator

## Project Structure

```text
student-management-system/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Prerequisites

Install the following software before running the project:

- Node.js (Node.js 22 LTS recommended)
- npm (comes with Node.js)
- Git
- MongoDB Community Server or a MongoDB Atlas database

## Installation and Setup

### 1. Clone the Repository

```bash
git clone --branch feature/full-stack-project https://github.com/sonukumar-dev1/student-management-system.git
```

### 2. Open the Project

```bash
cd student-management-system
```

### 3. Backend Setup

Open a terminal:

```bash
cd backend
npm install
```

### 4. Configure Backend Environment Variables

Create a `.env` file inside the `backend` folder.

Add the following configuration:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/student_management_system
JWT_SECRET=replace_with_a_long_random_secret
ADMIN_NAME=Project Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace_with_a_strong_password
```

**Important:**
- Make sure MongoDB Server is running if using a local MongoDB connection.
- For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.
- Use your own strong JWT secret and admin password.
- Never commit `.env` or share its secrets publicly.

### 5. Create Admin Account

From the `backend` directory, run:

```bash
node scripts/createAdmin.js
```

This creates the admin account using the credentials configured in `.env`.

If the admin already exists, the script will report that it already exists.

### 6. Start Backend Server

From the `backend` directory:

```bash
npm run dev
```

Alternatively:

```bash
npm start
```

Backend API will run at:

```text
http://localhost:5000
```

API health check:

```text
http://localhost:5000/
```

### 7. Frontend Setup

Open a **new terminal** in the project root:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite in the terminal. By default, it is:

```text
http://localhost:5173
```

Keep both backend and frontend terminals running while using the application.

## API Endpoints

Base URL:

```text
http://localhost:5000/api
```

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Student registration |
| POST | `/auth/login` | Student login |
| POST | `/auth/logout` | Student logout |

### Student

| Method | Endpoint | Description |
|---|---|---|
| GET | `/students/profile` | View own profile |
| PUT | `/students/profile` | Update own profile |

### Admin

| Method | Endpoint | Description |
|---|---|---|
| POST | `/admin/login` | Admin login |
| POST | `/admin/logout` | Admin logout |
| GET | `/admin/dashboard` | Admin dashboard API |
| GET | `/admin/students` | View all students |
| GET | `/admin/students/:id` | View student details |
| PUT | `/admin/students/:id` | Update student |
| DELETE | `/admin/students/:id` | Delete student |

Protected APIs require:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

## How to Test

1. Open the frontend in a browser.
2. Register a new student account.
3. Login using student credentials.
4. View and update the student profile.
5. Logout from the student account.
6. Login using the configured admin credentials.
7. View all registered students.
8. Edit and delete student records.
9. Logout from the admin account.

## Author

**Sonu Kumar**

BCA Student | Full Stack Developer

GitHub: https://github.com/sonukumar-dev1

---

**Student Management System – Full Stack Project**