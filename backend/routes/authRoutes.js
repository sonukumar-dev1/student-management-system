
const express = require("express");
const router = express.Router();

const {
    registerStudent,
    loginStudent,
    logoutStudent,
} = require("../controllers/authController");
const { registerValidator } = require("../middleware/validators");
const { protect } = require("../middleware/authMiddleware");
// Student Registration API
router.post("/register", registerValidator, registerStudent);
router.post("/login", loginStudent);
router.post("/logout", protect, logoutStudent);

module.exports = router;
