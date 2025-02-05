
import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export const fetchUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users`);
        return response.data;
    } catch (error) {
        console.error("Error fetching users", error);
        throw error;
    }
};


export const createUser = async (user) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users`, user);
        return response.data;
    } catch (error) {
        console.error("Can't add user", error);
        throw error;
    }
};

export const fetchUserById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users/${id}`);
        return response.data;
    } catch (error) {
        console.error("Can't fetch user", error);
        throw error;
    }
};


// Login function
export const login = async (email, password) => {
    try {
        // console.log("Sending request to login:", { email, password });
        const response = await axios.post(`${API_BASE_URL}/login`, { email, password });
        // console.log("Login response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Login failed", error.response || error);
        throw error;
    }
};

// Update user function
export const updateUser = async (userId, updatedFields) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
    });

    if (!response.ok) {
        throw new Error("Failed to update user");
    }

    return await response.json();
};
