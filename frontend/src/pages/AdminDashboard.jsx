
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import authService from "../services/authService";
import api from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
    const { user, token, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [editingStudent, setEditingStudent] = useState(null);
    const [search, setSearch] = useState("");

    const [editForm, setEditForm] = useState({
        name: "",
        phone: "",
        dateOfBirth: "",
    });

    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await api.get("/admin/students", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setStudents(response.data.students || []);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Failed to load students"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [token]);

    const handleEdit = (student) => {
        setEditingStudent(student);

        setEditForm({
            name: student.name || "",
            phone: student.phone || "",
            dateOfBirth: student.dateOfBirth
                ? new Date(student.dateOfBirth).toISOString().slice(0, 10)
                : "",
        });

        setError("");
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;

        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (
            !editForm.name.trim() ||
            !editForm.phone.trim() ||
            !editForm.dateOfBirth
        ) {
            alert("Please fill all fields.");
            return;
        }

        if (!/^\d{10}$/.test(editForm.phone.trim())) {
            alert("Phone number must contain exactly 10 digits.");
            return;
        }

        setUpdating(true);

        try {
            const response = await api.put(
                `/admin/students/${editingStudent._id}`,
                {
                    name: editForm.name.trim(),
                    phone: editForm.phone.trim(),
                    dateOfBirth: editForm.dateOfBirth,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updatedStudent = response.data.student;

            setStudents((prevStudents) =>
                prevStudents.map((student) =>
                    student._id === editingStudent._id
                        ? updatedStudent
                        : student
                )
            );

            setEditingStudent(null);
            alert("Student updated successfully!");
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Failed to update student."
            );
        } finally {
            setUpdating(false);
        }
    };

    const handleDelete = async (studentId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmDelete) return;

        setDeletingId(studentId);

        try {
            await api.delete(`/admin/students/${studentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setStudents((prevStudents) =>
                prevStudents.filter(
                    (student) => student._id !== studentId
                )
            );

            if (editingStudent?._id === studentId) {
                setEditingStudent(null);
            }
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Failed to delete student"
            );
        } finally {
            setDeletingId(null);
        }
    };

    const handleLogout = async () => {
        try {
            await authService.logoutAdmin(token);
        } catch (error) {
            console.error("Admin logout failed:", error);
        } finally {
            logout();
            navigate("/login", { replace: true });
        }
    };

    const filteredStudents = students.filter((student) => {
        const searchValue = search.toLowerCase();

        return (
            student.name?.toLowerCase().includes(searchValue) ||
            student.email?.toLowerCase().includes(searchValue) ||
            student.phone?.includes(searchValue)
        );
    });

    return (
        <div className="admin-layout">

            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <div className="brand-icon">S</div>
                    <span>Student<span className="brand-highlight">Hub</span></span>
                </div>

                <div className="sidebar-section-label">
                    MAIN MENU
                </div>

                <nav className="sidebar-nav">
                    <a href="#overview" className="sidebar-link active">
                        <span>▦</span> Overview
                    </a>

                    <a href="#students" className="sidebar-link">
                        <span>♙</span> Students
                    </a>
                </nav>

                <div className="sidebar-bottom">
                    <div className="sidebar-admin">
                        <div className="admin-avatar">
                            {user?.name?.charAt(0)?.toUpperCase() || "A"}
                        </div>

                        <div className="admin-details">
                            <strong>{user?.name || "Admin"}</strong>
                            <small>Administrator</small>
                        </div>
                    </div>

                    <button
                        className="sidebar-logout"
                        onClick={handleLogout}
                    >
                        ↪ Logout
                    </button>
                </div>
            </aside>

            <main className="admin-main">

                <header className="admin-topbar">
                    <div>
                        <h1>Dashboard Overview</h1>
                        <p>Manage your students and records</p>
                    </div>

                    <div className="topbar-profile">
                        <div className="topbar-avatar">
                            {user?.name?.charAt(0)?.toUpperCase() || "A"}
                        </div>

                        <div>
                            <strong>{user?.name || "Admin"}</strong>
                            <small>Admin Account</small>
                        </div>
                    </div>
                </header>

                <section className="welcome-section" id="overview">
                    <div>
                        <h2>Welcome back, {user?.name || "Admin"}! 👋</h2>
                        <p>Here is what's happening with your student records.</p>
                    </div>
                </section>

                <section className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon blue">♙</div>
                        <div>
                            <p>Total Students</p>
                            <h3>{students.length}</h3>
                            <small>Registered students</small>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon green">✓</div>
                        <div>
                            <p>Loaded Records</p>
                            <h3>{loading ? "..." : students.length}</h3>
                            <small>Records available</small>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon purple">⌕</div>
                        <div>
                            <p>Search Results</p>
                            <h3>{filteredStudents.length}</h3>
                            <small>Matching records</small>
                        </div>
                    </div>
                </section>

                <section className="students-section" id="students">

                    <div className="section-heading">
                        <div>
                            <h2>Student Management</h2>
                            <p>View, edit and manage student information.</p>
                        </div>

                        <span className="student-count">
                            {students.length} Students
                        </span>
                    </div>

                    <div className="table-toolbar">
                        <div className="search-box">
                            <span>⌕</span>
                            <input
                                type="text"
                                placeholder="Search by name, email or phone..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading && (
                        <div className="dashboard-message">
                            Loading students...
                        </div>
                    )}

                    {error && (
                        <div className="dashboard-error">
                            {error}
                        </div>
                    )}

                    {!loading && !error && (
                        filteredStudents.length === 0 ? (
                            <div className="empty-state">
                                <div>♙</div>
                                <h3>No students found</h3>
                                <p>
                                    {search
                                        ? "Try another search term."
                                        : "No students have registered yet."}
                                </p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <table className="students-table">
                                    <thead>
                                        <tr>
                                            <th>STUDENT</th>
                                            <th>EMAIL ADDRESS</th>
                                            <th>PHONE NUMBER</th>
                                            <th>DATE OF BIRTH</th>
                                            <th>ACTIONS</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredStudents.map((student) => (
                                            <tr key={student._id}>
                                                <td>
                                                    <div className="student-name-cell">
                                                        <div className="student-avatar">
                                                            {student.name?.charAt(0)?.toUpperCase() || "S"}
                                                        </div>

                                                        <strong>{student.name}</strong>
                                                    </div>
                                                </td>

                                                <td>{student.email}</td>
                                                <td>{student.phone}</td>

                                                <td>
                                                    {student.dateOfBirth
                                                        ? new Date(
                                                            student.dateOfBirth
                                                        ).toLocaleDateString()
                                                        : "-"}
                                                </td>

                                                <td>
                                                    <div className="action-buttons">
                                                        <button
                                                            className="edit-btn"
                                                            onClick={() => handleEdit(student)}
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="delete-btn"
                                                            onClick={() =>
                                                                handleDelete(student._id)
                                                            }
                                                            disabled={
                                                                deletingId === student._id
                                                            }
                                                        >
                                                            {deletingId === student._id
                                                                ? "Deleting..."
                                                                : "Delete"}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )
                    )}
                </section>

                {editingStudent && (
                    <div className="edit-modal-overlay">
                        <div className="edit-modal">
                            <div className="modal-header">
                                <div>
                                    <h2>Edit Student</h2>
                                    <p>Update student information</p>
                                </div>

                                <button
                                    className="modal-close"
                                    onClick={() => setEditingStudent(null)}
                                    disabled={updating}
                                >
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleUpdate}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editForm.name}
                                        onChange={handleEditChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input
                                        type="email"
                                        value={editingStudent.email}
                                        disabled
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={editForm.phone}
                                        onChange={handleEditChange}
                                        maxLength="10"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Date of Birth</label>
                                    <input
                                        type="date"
                                        name="dateOfBirth"
                                        value={editForm.dateOfBirth}
                                        onChange={handleEditChange}
                                        max={new Date().toISOString().slice(0, 10)}
                                        required
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={() => setEditingStudent(null)}
                                        disabled={updating}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="save-btn"
                                        disabled={updating}
                                    >
                                        {updating ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <footer className="admin-footer">
                    StudentHub Admin Panel · Student Management System
                </footer>

            </main>
        </div>
    );
}

export default AdminDashboard;
