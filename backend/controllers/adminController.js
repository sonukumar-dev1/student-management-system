
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Find admin in database
        const admin = await Admin.findOne({
            email: email.toLowerCase().trim(),
        }).select("+password");

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Compare entered password with hashed password
        const isPasswordValid = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: admin._id,
                role: admin.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            success: true,
            message: "Admin login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error during admin login",
        });
    }
};


const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().select("-password");

        return res.status(200).json({
            success: true,
            count: students.length,
            students,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch students",
        });
    }
};

// Get student id 
const getStudentById = async (req, res) => {
    try {
        const { id } = req.params;

        // Find student by MongoDB ID
        const student = await Student.findById(id).select("-password");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        return res.status(200).json({
            success: true,
            student,
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to fetch student",
        });
    }
};

// Update Student 
const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, dateOfBirth } = req.body;

        // Check whether at least one field is provided
        if (
            name === undefined &&
            phone === undefined &&
            dateOfBirth === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "At least one field is required",
            });
        }

        const updates = {};

        // Validate name
        if (name !== undefined) {
            if (typeof name !== "string" || !name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Name cannot be empty",
                });
            }
            updates.name = name.trim();
        }

        // Validate phone
        if (phone !== undefined) {
            if (!/^[0-9]{10}$/.test(phone)) {
                return res.status(400).json({
                    success: false,
                    message: "Phone number must contain exactly 10 digits",
                });
            }
            updates.phone = phone;
        }

        // Validate date of birth
        if (dateOfBirth !== undefined) {
            const datePattern = /^\d{4}-\d{2}-\d{2}$/;
            const dob = new Date(`${dateOfBirth}T00:00:00.000Z`);

            if (
                !datePattern.test(dateOfBirth) ||
                Number.isNaN(dob.getTime()) ||
                dob.toISOString().slice(0, 10) !== dateOfBirth ||
                dob >= new Date()
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide a valid past date of birth",
                });
            }

            updates.dateOfBirth = dob;
        }

        const student = await Student.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select("-password");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Student updated successfully",
            student,
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to update student",
        });
    }
};

const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await Student.findByIdAndDelete(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Student deleted successfully",
        });

    } catch (error) {
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to delete student",
        });
    }
};

module.exports = {
    loginAdmin,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
};