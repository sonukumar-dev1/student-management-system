
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

    // Fetch Student Profile
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

    // Handle Form Input
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Open Edit Form
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

    // Update Student Profile
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

            // Fetch updated profile including age
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

    // Student Logout
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

    return (
        <div className="student-dashboard">
            <div className="student-card">
                <h1>Student Dashboard</h1>

                <p>
                    Welcome, {student?.name || user?.name || "Student"}!
                </p>

                <hr />

                <h2>My Profile</h2>

                {loading && <p>Loading profile...</p>}

                {error && (
                    <p style={{ color: "red" }}>{error}</p>
                )}

                {!loading && student && !editing && (
                    <div>
                        <p><strong>Name:</strong> {student.name}</p>

                        <p><strong>Email:</strong> {student.email}</p>

                        <p><strong>Phone:</strong> {student.phone}</p>

                        <p>
                            <strong>Date of Birth:</strong>{" "}
                            {student.dateOfBirth
                                ? new Date(
                                    student.dateOfBirth
                                ).toLocaleDateString()
                                : "-"}
                        </p>

                        <p><strong>Age:</strong> {student.age} years</p>

                        <button
                            onClick={handleEdit}
                            style={{
                                background: "#2563eb",
                                color: "white",
                                border: "none",
                                padding: "11px 20px",
                                borderRadius: "7px",
                                cursor: "pointer",
                                marginTop: "10px",
                            }}
                        >
                            Edit Profile
                        </button>
                    </div>
                )}

                {editing && (
                    <form onSubmit={handleUpdate}>
                        <div style={{ marginBottom: "15px" }}>
                            <label><strong>Name</strong></label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label><strong>Email</strong></label>
                            <input
                                type="email"
                                value={student.email}
                                disabled
                                style={{
                                    ...inputStyle,
                                    background: "#e5e7eb",
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label><strong>Phone Number</strong></label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                maxLength="10"
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: "15px" }}>
                            <label><strong>Date of Birth</strong></label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                max={new Date().toISOString().slice(0, 10)}
                                required
                                style={inputStyle}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                background: "#16a34a",
                                color: "white",
                                border: "none",
                                padding: "11px 20px",
                                borderRadius: "7px",
                                cursor: "pointer",
                            }}
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setEditing(false)}
                            disabled={saving}
                            style={{
                                background: "#64748b",
                                color: "white",
                                border: "none",
                                padding: "11px 20px",
                                borderRadius: "7px",
                                cursor: "pointer",
                                marginLeft: "10px",
                            }}
                        >
                            Cancel
                        </button>
                    </form>
                )}

                <hr />

                <button
                    onClick={handleLogout}
                    style={{
                        background: "#dc2626",
                        color: "white",
                        border: "none",
                        padding: "11px 22px",
                        borderRadius: "7px",
                        cursor: "pointer",
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

const inputStyle = {
    display: "block",
    width: "100%",
    boxSizing: "border-box",
    padding: "11px",
    marginTop: "7px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    fontSize: "14px",
};

export default StudentDashboard;
