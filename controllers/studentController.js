
const Student = require("../models/Student");

// Get Logged-in Student Profile
const getStudentProfile = async (req, res) => {
    try {
        const student = await Student.findById(req.user.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        const today = new Date();
        const dob = new Date(student.dateOfBirth);

        let age = today.getFullYear() - dob.getFullYear();

        const monthDifference = today.getMonth() - dob.getMonth();

        if (
            monthDifference < 0 ||
            (monthDifference === 0 && today.getDate() < dob.getDate())
        ) {
            age--;
        }

        return res.status(200).json({
            success: true,
            message: "Student profile fetched successfully",
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                phone: student.phone,
                dateOfBirth: student.dateOfBirth,
                age,
            },
        });
    } catch (error) {
        console.error("Profile Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while fetching profile",
        });
    }
};

// Update Student profile
const updateStudentProfile = async (req, res) => {
    try {
        const { name, phone, dateOfBirth } = req.body;

        const updates = {};

        if (name !== undefined) {
            if (typeof name !== "string" || !name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Name cannot be empty",
                });
            }

            updates.name = name.trim();
        }

        if (phone !== undefined) {
            if (
                typeof phone !== "string" ||
                !/^[0-9]{10}$/.test(phone.trim())
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Phone number must be 10 digits",
                });
            }

            updates.phone = phone.trim();
        }

        if (dateOfBirth !== undefined) {
            const dob = new Date(dateOfBirth);

            if (
                typeof dateOfBirth !== "string" ||
                !/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth) ||
                Number.isNaN(dob.getTime()) ||
                dob.toISOString().slice(0, 10) !== dateOfBirth ||
                dob >= new Date()
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Enter a valid past date of birth",
                });
            }

            updates.dateOfBirth = dob;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Provide at least one field to update",
            });
        }

        const student = await Student.findByIdAndUpdate(
            req.user.id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                phone: student.phone,
                dateOfBirth: student.dateOfBirth,
            },
        });
    } catch (error) {
        console.error("Profile Update Error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Server error while updating profile",
        });
    }
};

module.exports = {
    getStudentProfile,
    updateStudentProfile
};
