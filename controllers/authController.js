
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const crypto = require("crypto");
const TokenBlacklist = require("../models/TokenBlacklist");
// Student Registration
const registerStudent = async (req, res) => {
    try {
        // Validate request data
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        const { name, email, phone, dateOfBirth, password } = req.body;

        // Check existing student
        const existingStudent = await Student.findOne({ email });

        if (existingStudent) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create student
        const student = await Student.create({
            name,
            email,
            phone,
            dateOfBirth,
            password: hashedPassword,
        });

        // Generate JWT
        const token = jwt.sign(
            { id: student._id, role: "student" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(201).json({
            success: true,
            message: "Student registered successfully",
            token,
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                phone: student.phone,
                dateOfBirth: student.dateOfBirth,
            },
        });
    } catch (error) {
        console.error("Registration Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error during registration",
        });
    }
};

// Login Student

const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const student = await Student.findOne({
            email: email.toLowerCase().trim(),
        }).select("+password");

        if (!student) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            student.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            { id: student._id, role: "student" },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                phone: student.phone,
                dateOfBirth: student.dateOfBirth,
            },
        });
    } catch (error) {
        console.error("Login Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error during login",
        });
    }
};

// Logout Student 
const logoutStudent = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const decoded = jwt.decode(token);

        await TokenBlacklist.create({
            tokenHash,
            expiresAt: new Date(decoded.exp * 1000),
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        console.error("Logout Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error during logout",
        });
    }
};

module.exports = {
    registerStudent,
    loginStudent,
    logoutStudent,
};
