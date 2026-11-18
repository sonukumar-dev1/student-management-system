
import api from "./api";

// Get Student Profile
const getStudentProfile = async (token) => {
    const response = await api.get("/students/profile", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// Update Student Profile
const updateStudentProfile = async (profileData, token) => {
    const response = await api.put("/students/profile", profileData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

const studentService = {
    getStudentProfile,
    updateStudentProfile,
};

export default studentService;
