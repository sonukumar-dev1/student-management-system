
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import authService from "../services/authService";
import api from "../services/api";
import "./StudentDashboard.css";

function StudentDashboard() {
    const { user, token, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        dateOfBirth: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/students/profile", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const profile = response.data.student;

                setStudent(profile);

                setFormData({
                    name: profile.name || "",
                    phone: profile.phone || "",
                    dateOfBirth: profile.dateOfBirth
                        ? new Date(profile.dateOfBirth)
                            .toISOString()
                            .slice(0, 10)
                        : "",
                });
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load student profile"
                );
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchProfile();
        }
    }, [token]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEdit = () => {
        setFormData({
            name: student.name || "",
            phone: student.phone || "",
            dateOfBirth: student.dateOfBirth
                ? new Date(student.dateOfBirth)
                    .toISOString()
                    .slice(0, 10)
                : "",
        });

        setEditing(true);
        setError("");
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Name cannot be empty.");
            return;
        }

        if (!/^\d{10}$/.test(formData.phone.trim())) {
            alert("Phone number must contain exactly 10 digits.");
            return;
        }

        if (!formData.dateOfBirth) {
            alert("Please select your date of birth.");
            return;
        }

        setSaving(true);

        try {
            const response = await api.put(
                "/students/profile",
                {
                    name: formData.name.trim(),
                    phone: formData.phone.trim(),
                    dateOfBirth: formData.dateOfBirth,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const profileResponse = await api.get(
                "/students/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setStudent(profileResponse.data.student);
            setEditing(false);

            alert(
                response.data.message ||
                "Profile updated successfully!"
            );
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Failed to update profile"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logoutStudent(token);
        } catch (error) {
            console.error("Student logout failed:", error);
        } finally {
            logout();
            navigate("/login", { replace: true });
        }
    };

    const firstLetter = (
        student?.name || user?.name || "S"
    ).charAt(0).toUpperCase();

    return (
        <div className="student-layout">

            <aside className="student-sidebar">
                <div className="student-brand">
                    <div className="student-brand-icon">S</div>
                    <span>Student<span>Hub</span></span>
                </div>

                <p className="student-menu-label">STUDENT MENU</p>

                <nav className="student-sidebar-nav">
                    <a href="#overview" className="student-nav-link active">
                        <span>▦</span>
                        Overview
                    </a>

                    <a href="#profile" className="student-nav-link">
                        <span>♙</span>
                        My Profile
                    </a>
                </nav>

                <div className="student-sidebar-bottom">
                    <div className="student-sidebar-user">
                        <div className="student-user-avatar">
                            {firstLetter}
                        </div>

                        <div>
                            <strong>
                                {student?.name || user?.name || "Student"}
                            </strong>
                            <small>Student Account</small>
                        </div>
                    </div>

                    <button
                        className="student-logout-btn"
                        onClick={handleLogout}
                    >
                        ↪ Logout
                    </button>
                </div>
            </aside>

            <main className="student-main">

                <header className="student-topbar">
                    <div>
                        <h1>Student Dashboard</h1>
                        <p>Manage your personal information</p>
                    </div>

                    <div className="student-topbar-profile">
                        <div className="student-topbar-avatar">
                            {firstLetter}
                        </div>

                        <div>
                            <strong>
                                {student?.name || user?.name || "Student"}
                            </strong>
                            <small>Student</small>
                        </div>
                    </div>
                </header>

                <section className="student-welcome" id="overview">
                    <div>
                        <span className="welcome-tag">STUDENT PORTAL</span>

                        <h2>
                            Welcome back,{" "}
                            {student?.name || user?.name || "Student"}! 👋
                        </h2>

                        <p>
                            View and manage your student profile from one place.
                        </p>
                    </div>

                    <div className="welcome-decoration">🎓</div>
                </section>

                {loading && (
                    <div className="student-loading">
                        Loading your profile...
                    </div>
                )}

                {error && (
                    <div className="student-error">
                        {error}
                    </div>
                )}

                {!loading && student && (
                    <>
                        <section className="student-summary-grid">
                            <div className="student-summary-card">
                                <div className="summary-icon blue">♙</div>
                                <div>
                                    <p>Full Name</p>
                                    <h3>{student.name}</h3>
                                </div>
                            </div>

                            <div className="student-summary-card">
                                <div className="summary-icon green">@</div>
                                <div>
                                    <p>Email Address</p>
                                    <h3 className="summary-email">
                                        {student.email}
                                    </h3>
                                </div>
                            </div>

                            <div className="student-summary-card">
                                <div className="summary-icon purple">▤</div>
                                <div>
                                    <p>Age</p>
                                    <h3>
                                        {student.age ?? "-"} years
                                    </h3>
                                </div>
                            </div>
                        </section>

                        <section className="student-profile-section" id="profile">
                            <div className="student-section-heading">
                                <div>
                                    <h2>My Profile</h2>
                                    <p>
                                        Your personal and contact information
                                    </p>
                                </div>

                                {!editing && (
                                    <button
                                        className="student-edit-btn"
                                        onClick={handleEdit}
                                    >
                                        ✎ Edit Profile
                                    </button>
                                )}
                            </div>

                            {!editing ? (
                                <div className="student-profile-content">
                                    <div className="profile-avatar-large">
                                        {firstLetter}
                                    </div>

                                    <div className="student-profile-details">
                                        <div className="profile-detail">
                                            <span>Full Name</span>
                                            <strong>{student.name}</strong>
                                        </div>

                                        <div className="profile-detail">
                                            <span>Email Address</span>
                                            <strong>{student.email}</strong>
                                        </div>

                                        <div className="profile-detail">
                                            <span>Phone Number</span>
                                            <strong>{student.phone}</strong>
                                        </div>

                                        <div className="profile-detail">
                                            <span>Date of Birth</span>
                                            <strong>
                                                {student.dateOfBirth
                                                    ? new Date(
                                                        student.dateOfBirth
                                                    ).toLocaleDateString()
                                                    : "-"}
                                            </strong>
                                        </div>

                                        <div className="profile-detail">
                                            <span>Age</span>
                                            <strong>
                                                {student.age ?? "-"} years
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <form
                                    className="student-edit-form"
                                    onSubmit={handleUpdate}
                                >
                                    <div className="student-form-grid">
                                        <div className="student-form-group">
                                            <label>Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="student-form-group">
                                            <label>Email Address</label>
                                            <input
                                                type="email"
                                                value={student.email}
                                                disabled
                                            />
                                        </div>

                                        <div className="student-form-group">
                                            <label>Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                maxLength="10"
                                                required
                                            />
                                        </div>

                                        <div className="student-form-group">
                                            <label>Date of Birth</label>
                                            <input
                                                type="date"
                                                name="dateOfBirth"
                                                value={formData.dateOfBirth}
                                                onChange={handleChange}
                                                max={new Date()
                                                    .toISOString()
                                                    .slice(0, 10)}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="student-form-actions">
                                        <button
                                            type="button"
                                            className="student-cancel-btn"
                                            onClick={() => setEditing(false)}
                                            disabled={saving}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="submit"
                                            className="student-save-btn"
                                            disabled={saving}
                                        >
                                            {saving
                                                ? "Saving..."
                                                : "Save Changes"}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </section>
                    </>
                )}

                <footer className="student-footer">
                    StudentHub Student Portal · Student Management System
                </footer>

            </main>
        </div>
    );
}

export default StudentDashboard;
