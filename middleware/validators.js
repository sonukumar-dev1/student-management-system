
const { body } = require("express-validator");

const registerValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Enter a valid email"),

    body("phone")
        .trim()
        .matches(/^[0-9]{10}$/)
        .withMessage("Phone number must be 10 digits"),

    body("dateOfBirth")
        .isISO8601()
        .withMessage("Enter a valid date of birth")
        .custom((value) => {
            const dob = new Date(value);

            if (dob >= new Date()) {
                throw new Error("Date of birth must be in the past");
            }

            return true;
        }),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),
];

module.exports = { registerValidator };
