
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        const { confirmPassword, ...studentData } = formData;

        try {
            setLoading(true);

            await authService.registerStudent(studentData);

            navigate("/login", {
                state: {
                    message: "Registration successful! Please login.",
                },
            });
        } catch (err) {
            const validationErrors = err.response?.data?.errors;

            if (validationErrors?.length) {
                setError(validationErrors[0].msg);
            } else {
                setError(
                    err.response?.data?.message ||
                    "Registration failed. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">

            {/* Left Branding Section */}
            <section className="register-brand">
                <div className="register-brand-content">

                    <div className="register-brand-logo">
                        SMS
                    </div>

                    <h1>
                        Start Your
                        <br />
                        Academic Journey
                    </h1>

                    <p>
                        Create your student account and access your
                        academic information, profile and student
                        dashboard from one secure platform.
                    </p>

                    <div className="register-brand-footer">
                        STUDENT MANAGEMENT SYSTEM
                    </div>
                </div>

                <div className="register-decoration register-decoration-one"></div>
                <div className="register-decoration register-decoration-two"></div>
            </section>

            {/* Right Registration Section */}
            <section className="register-section">
                <div className="register-card">

                    <div className="register-heading">
                        <span className="register-welcome-label">
                            STUDENT REGISTRATION
                        </span>

                        <h2>Create Your Account</h2>

                        <p>
                            Fill in your details to get started with
                            your student account.
                        </p>
                    </div>

                    {error && (
                        <div className="register-error" role="alert">
                            {error}
                        </div>
                    )}

                    <form className="register-form" onSubmit={handleSubmit}>

                        <div className="register-field">
                            <label htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="register-field">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="register-field">
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                id="phone"
                                type="tel"
                                name="phone"
                                placeholder="10-digit phone number"
                                value={formData.phone}
                                onChange={handleChange}
                                pattern="[0-9]{10}"
                                maxLength={10}
                                required
                            />
                        </div>

                        <div className="register-field">
                            <label htmlFor="dateOfBirth">Date of Birth</label>
                            <input
                                id="dateOfBirth"
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                max={new Date().toISOString().split("T")[0]}
                                required
                            />
                        </div>

                        <div className="register-field">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Minimum 8 characters"
                                value={formData.password}
                                onChange={handleChange}
                                minLength={8}
                                required
                            />
                        </div>

                        <div className="register-field">
                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                placeholder="Re-enter your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                minLength={8}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="register-button"
                            disabled={loading}
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="register-footer">
                        Already have an account?{" "}
                        <Link to="/login">Sign In</Link>
                    </p>

                    <div className="register-copyright">
                        © 2026 Student Management System. All rights reserved.
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Register;
