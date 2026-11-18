
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const TokenBlacklist = require("../models/TokenBlacklist");

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. Authentication token required",
            });
        }

        const token = authHeader.split(" ")[1];

        // Verify JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Generate token hash
        const tokenHash = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        // Check whether token is blacklisted
        const blacklistedToken = await TokenBlacklist.findOne({
            tokenHash,
        });

        if (blacklistedToken) {
            return res.status(401).json({
                success: false,
                message: "Token has been logged out. Please login again",
            });
        }

        req.user = {
            id: decoded.id,
            role: decoded.role,
        };

        req.token = token;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};

// Role-Based Authorization Middleware
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You do not have permission",
            });
        }

        next();
    };
};

module.exports = { protect, authorizeRoles };

