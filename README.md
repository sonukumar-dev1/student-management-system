# Student Management System – Backend

A secure and structured RESTful API for managing student records and administrative operations. This backend provides authentication, role-based authorization, student profile management, and administrative control over student records.

## Features

### Authentication & Authorization
- Student registration and login
- Admin login
- JWT-based authentication
- Password hashing using bcrypt
- Role-based access control
- Secure logout with token blacklisting

### Student Features
- Register a new student account
- Login securely
- View personal profile
- Update personal profile
- Calculate student age from date of birth
- Secure logout

### Admin Features
- Secure admin authentication
- View all registered students
- View individual student details
- Update student information
- Delete student records
- Protected admin routes

## Tech Stack

- **Runtime:** Node.js
- **Backend Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JSON Web Token (JWT)
- **Password Security:** bcrypt
- **Request Validation:** express-validator

## Project Structure

```text
backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── adminController.js
│   ├── authController.js
│   └── studentController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── validators.js
│
├── models/
│   ├── Admin.js
│   ├── Student.js
│   └── TokenBlacklist.js
│
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   └── studentRoutes.js
│
├── scripts/
│   └── createAdmin.js
│
├── .env
├── .gitignore
├── package.json
└── server.js
```

## API Endpoints

Base URL:

```text
http://localhost:5000/api
```

### Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a student |
| POST | `/auth/login` | Student login |
| POST | `/auth/logout` | Student logout |

### Student APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/students/profile` | Get logged-in student profile |
| PUT | `/students/profile` | Update student profile |

### Admin APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/admin/login` | Admin login |
| POST | `/admin/logout` | Admin logout |
| GET | `/admin/dashboard` | Access admin dashboard |
| GET | `/admin/students` | Get all students |
| GET | `/admin/students/:id` | Get student by ID |
| PUT | `/admin/students/:id` | Update student |
| DELETE | `/admin/students/:id` | Delete student |

## Authentication

Protected APIs require a valid JWT token in the request header.

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

Role-based middleware ensures that students and administrators can access only their authorized resources.

## Student Registration Fields

The student registration API accepts:

- Name
- Email
- Phone Number
- Date of Birth
- Password

Passwords are hashed before being stored in the database.

## Student Profile Update

Students can update their own:

- Name
- Phone Number
- Date of Birth

Email and password are not updated through this profile API.

## Admin Operations

Administrators can:

- View all registered students
- View individual student information
- Edit student details
- Delete student records

Admin operations are protected by JWT authentication and role-based authorization.

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sonukumar-dev1/student-management-system.git
```

### 2. Navigate to Backend

```bash
cd student-management-system/backend
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the backend directory.

Add your MongoDB connection string, server port, and JWT secret using the variable names expected by your backend configuration.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

**Important:** Never upload your actual `.env` file or secret keys to GitHub.

### 5. Start the Server

```bash
npm start
```

If your project does not have a start script configured, run:

```bash
node server.js
```

## API Testing

The backend APIs can be tested using Postman.

Test the following operations:

- Student registration
- Student login
- Admin login
- Student profile retrieval
- Student profile update
- Admin student listing
- Admin student update
- Admin student deletion
- Student and admin logout

## Security

- Passwords are stored using bcrypt hashing.
- JWT authentication protects private routes.
- Role-based authorization restricts access.
- Token blacklisting supports secure logout.
- Input validation helps prevent invalid data.

## Author

**Sonu Kumar**

BCA Student | Full Stack Developer

GitHub: https://github.com/sonukumar-dev1

---

**Student Management System – Backend**