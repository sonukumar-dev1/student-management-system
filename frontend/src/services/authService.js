
import api from "./api";

// Student Registration
const registerStudent = async (studentData) => {
    const response = await api.post("/auth/register", studentData);
    return response.data;
};

// Student Login
const loginStudent = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
};

// Admin Login
const loginAdmin = async (credentials) => {
    const response = await api.post("/admin/login", credentials);
    return response.data;
};

// Student Logout
const logoutStudent = async (token) => {
    const response = await api.post(
        "/auth/logout",
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

// Admin Logout
const logoutAdmin = async (token) => {
    const response = await api.post(
        "/admin/logout",
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
};

const authService = {
    registerStudent,
    loginStudent,
    loginAdmin,
    logoutStudent,
    logoutAdmin,
};

export default authService;
