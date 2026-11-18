
const express = require("express");
const router = express.Router();
const {
    loginAdmin,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
} = require("../controllers/adminController");
const { logoutStudent } = require("../controllers/authController");
const {
    protect,
    authorizeRoles,
} = require("../middleware/authMiddleware");

// Public Admin Login
router.post("/login", loginAdmin);

// Protected Admin Route (testing)
router.get(
    "/dashboard",
    protect,
    authorizeRoles("admin"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Welcome to Admin Dashboard",
            user: req.user,
        });
    }
);

// Admin Logout
router.post(
    "/logout",
    protect,
    authorizeRoles("admin"),
    logoutStudent
);

// Get All Students (Admin Only)
router.get(
    "/students",
    protect,
    authorizeRoles("admin"),
    getAllStudents
);

// Get Single Student by ID (Admin Only)
router.get(
    "/students/:id",
    protect,
    authorizeRoles("admin"),
    getStudentById
);

// Update Student (Admin Only)
router.put(
    "/students/:id",
    protect,
    authorizeRoles("admin"),
    updateStudent
);

// Delete Student (Admin Only)
router.delete(
    "/students/:id",
    protect,
    authorizeRoles("admin"),
    deleteStudent
);
module.exports = router;
