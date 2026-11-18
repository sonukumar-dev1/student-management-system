
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

    // Edit states
    const [editingStudent, setEditingStudent] = useState(null);
    const [editForm, setEditForm] = useState({
        name: "",
        phone: "",
        dateOfBirth: "",
    });
    const [updating, setUpdating] = useState(false);

    // Fetch all students
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

    // Open Edit Form
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

    // Handle Input Changes
    const handleEditChange = (e) => {
        const { name, value } = e.target;

        setEditForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Update Student
    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!editForm.name.trim() || !editForm.phone.trim() || !editForm.dateOfBirth) {
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

    // Delete student
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

    // Admin Logout
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

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>

            <p>Welcome, {user?.name || "Admin"}!</p>
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role}</p>

            <hr />

            <h2>All Students</h2>

            {loading && <p>Loading students...</p>}

            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Edit Student Form */}
            {editingStudent && (
                <div className="edit-student-form">
                    <h2>Edit Student</h2>

                    <form onSubmit={handleUpdate}>
                        <div>
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={editForm.name}
                                onChange={handleEditChange}
                                required
                            />
                        </div>

                        <div>
                            <label>Email</label>
                            <input
                                type="email"
                                value={editingStudent.email}
                                disabled
                            />
                        </div>

                        <div>
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

                        <div>
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

                        <button type="submit" disabled={updating}>
                            {updating ? "Saving..." : "Save Changes"}
                        </button>

                        <button
                            type="button"
                            onClick={() => setEditingStudent(null)}
                            disabled={updating}
                            style={{
                                background: "#64748b",
                                marginLeft: "10px",
                            }}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}

            {!loading && !error && (
                <>
                    <p>Total Students: {students.length}</p>

                    {students.length === 0 ? (
                        <p>No students registered yet.</p>
                    ) : (
                        <div style={{ overflowX: "auto" }}>
                            <table
                                border="1"
                                cellPadding="10"
                                cellSpacing="0"
                                style={{
                                    width: "100%",
                                    borderCollapse: "collapse",
                                    textAlign: "left",
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Date of Birth</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {students.map((student) => (
                                        <tr key={student._id}>
                                            <td>{student.name}</td>
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
                                                <button
                                                    onClick={() => handleEdit(student)}
                                                    style={{
                                                        background: "#2563eb",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "7px 12px",
                                                        borderRadius: "5px",
                                                        cursor: "pointer",
                                                        marginRight: "8px",
                                                    }}
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        handleDelete(student._id)
                                                    }
                                                    disabled={
                                                        deletingId === student._id
                                                    }
                                                    style={{
                                                        background: "#dc2626",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "7px 12px",
                                                        borderRadius: "5px",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {deletingId === student._id
                                                        ? "Deleting..."
                                                        : "Delete"}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            <br />

            <button onClick={handleLogout}>Logout</button>
        </div>
    );
}

export default AdminDashboard;
