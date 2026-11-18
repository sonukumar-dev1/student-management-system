
import api from "./api";

// Get All Students
const getAllStudents = async (token) => {
    const response = await api.get("/admin/students", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// Get Student By ID
const getStudentById = async (id, token) => {
    const response = await api.get(`/admin/students/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// Update Student
const updateStudent = async (id, studentData, token) => {
    const response = await api.put(`/admin/students/${id}`, studentData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// Delete Student
const deleteStudent = async (id, token) => {
    const response = await api.delete(`/admin/students/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

const adminService = {
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
};

export default adminService;
