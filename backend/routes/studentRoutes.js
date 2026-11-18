
const express = require("express");
const router = express.Router();

const {
    protect,
    authorizeRoles,
} = require("../middleware/authMiddleware");
const {
    getStudentProfile,
    updateStudentProfile,
} = require("../controllers/studentController");

// Protected Student Profile API
router.get(
    "/profile",
    protect,
    authorizeRoles("student"),
    getStudentProfile
);

router.put(
    "/profile",
    protect,
    authorizeRoles("student"),
    updateStudentProfile
);
module.exports = router;
