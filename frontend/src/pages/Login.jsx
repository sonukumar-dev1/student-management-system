
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import authService from "../services/authService";
import "./Login.css";

function Login() {
    const [role, setRole] = useState("student");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const credentials = {
                email: email.trim(),
                password,
            };

            const response =
                role === "student"
                    ? await authService.loginStudent(credentials)
                    : await authService.loginAdmin(credentials);

            const userData =
                role === "student"
                    ? response.student
                    : response.admin;

            if (!response.success || !response.token || !userData) {
                throw new Error("Invalid login response from server");
            }

            // Save user details and token in AuthContext
            login(
                {
                    ...userData,
                    role,
                },
                response.token
            );

            // Redirect according to user role
            if (role === "admin") {
                navigate("/admin/dashboard", { replace: true });
            } else {
                navigate("/student/dashboard", { replace: true });
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Login failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <section className="login-brand">
                <div className="brand-content">
                    <div className="brand-logo">SMS</div>

                    <h1>Student Management System</h1>

                    <p>
                        A smarter way to manage student information,
                        academic records and administration.
                    </p>

                    <div className="brand-footer">
                        Secure. Simple. Efficient.
                    </div>
                </div>

                <div className="brand-decoration decoration-one"></div>
                <div className="brand-decoration decoration-two"></div>
            </section>

            <section className="login-section">
                <div className="login-card">
                    <div className="login-heading">
                        <span className="welcome-label">WELCOME BACK</span>
                        <h2>Sign in to your account</h2>
                        <p>Please enter your details to continue.</p>
                    </div>

                    <div className="login-tabs">
                        <button
                            type="button"
                            className={role === "student" ? "active" : ""}
                            onClick={() => {
                                setRole("student");
                                setError("");
                            }}
                        >
                            Student
                        </button>

                        <button
                            type="button"
                            className={role === "admin" ? "active" : ""}
                            onClick={() => {
                                setRole("admin");
                                setError("");
                            }}
                        >
                            Admin
                        </button>
                    </div>

                    {error && (
                        <p
                            role="alert"
                            style={{
                                color: "#dc2626",
                                background: "#fef2f2",
                                padding: "10px 12px",
                                borderRadius: "8px",
                                fontSize: "13px",
                                marginBottom: "16px",
                            }}
                        >
                            {error}
                        </p>
                    )}

                    <form className="login-form" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            className="login-button"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing In..."
                                : `Sign In as ${role === "student" ? "Student" : "Admin"}`}
                            <span>→</span>
                        </button>
                    </form>

                    {role === "student" && (
                        <div className="login-register-link">
                            Don't have an account?{" "}
                            <Link to="/register">Create Account</Link>
                        </div>
                    )}

                    <div className="login-security">
                        <span>🔒</span>
                        Your information is protected and secure.
                    </div>
                </div>

                <p className="login-copyright">
                    © 2026 Student Management System. All rights reserved.
                </p>
            </section>
        </div>
    );
}

export default Login;
