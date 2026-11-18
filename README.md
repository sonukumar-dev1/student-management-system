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
- Logout

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
│   ├
