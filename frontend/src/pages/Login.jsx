
import { useState } from "react";
import "./Login.css";

function Login() {
    const [role, setRole] = useState("student");

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
                            onClick={() => setRole("student")}
                        >
                            Student
                        </button>

                        <button
                            type="button"
                            className={role === "admin" ? "active" : ""}
                            onClick={() => setRole("admin")}
                        >
                            Admin
                        </button>
                    </div>

                    <form className="login-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                autoComplete="email"
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
                                required
                            />
                        </div>

                        <button className="login-button" type="submit">
                            Sign In as {role === "student" ? "Student" : "Admin"}
                            <span>→</span>
                        </button>
                    </form>

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
