import React, { useState, useEffect } from "react";
import {
    Box,
    List,
    ListItem,
    TextField,
    Button,
    Avatar,
    Typography,
    Paper,
    IconButton,
    CircularProgress,
    Divider,
} from "@mui/material";
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import { fetchUsers, fetchUserById, updateUser } from "../api";
import { useNavigate, useSearchParams } from "react-router-dom";

const ChatPage = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [editingProfile, setEditingProfile] = useState(false);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const userId = searchParams.get("userId");
    const selectedUserId = searchParams.get("selectedUserId");
    const loggedInUser = JSON.parse(localStorage.getItem("user")) || {};


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploading(true);
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setProfileData((prevData) => ({ ...prevData, image_url: reader.result }));
                setUploading(false);
            };
            reader.onerror = (error) => {
                console.error("Error converting image to Base64:", error);
                setUploading(false);
            };
        }
    };


    const [profileData, setProfileData] = useState({
        username: loggedInUser.username || "",
        email: loggedInUser.email || "",
        password: "",
        image_url: loggedInUser.image_url || "",
        old_password: "", 
        new_password: "", 
    });


    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevData) => ({
            ...prevData,
            [name]: value || "", 
        }));
    };

    const handleProfileUpdate = async () => {
        try {
            const updatedFields = {};

            if (profileData.username && profileData.username !== loggedInUser.username) {
                updatedFields.username = profileData.username;
            }
            if (profileData.email && profileData.email !== loggedInUser.email) {
                updatedFields.email = profileData.email;
            }
            if (profileData.image_url && profileData.image_url !== loggedInUser.image_url) {
                updatedFields.image_url = profileData.image_url;  // Base64-encoded image
            }

            if ((profileData.old_password && profileData.old_password.trim() !== "") ||
                (profileData.new_password && profileData.new_password.trim() !== "")) {

                if (!profileData.old_password.trim()) {
                    alert("Please enter your old password to update the password.");
                    return;
                }
                if (!profileData.new_password.trim()) {
                    alert("Please enter a new password.");
                    return;
                }

                updatedFields.old_password = profileData.old_password;
                updatedFields.new_password = profileData.new_password;
            }

            if (Object.keys(updatedFields).length === 0) {
                console.log("No changes detected, skipping update.");
                return;
            }

            const updatedUser = await updateUser(loggedInUser.id, updatedFields);
            localStorage.setItem("user", JSON.stringify({ ...loggedInUser, ...updatedFields }));

            setProfileData((prev) => ({
                ...prev,
                old_password: "",
                new_password: "",
                ...updatedFields,
            }));

            setEditingProfile(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile. Please check your old password and try again.");
        }
    };

    useEffect(() => {
        if (!loggedInUser.id) {
            navigate("/login");
        }
    }, [navigate, loggedInUser]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const userList = await fetchUsers();
                setUsers(userList.filter((user) => user.id !== loggedInUser.id));
            } catch (error) {
                console.error("Error loading users:", error);
            }
        };
        loadUsers();
    }, []);

    useEffect(() => {
        if (selectedUserId) {
            handleUserSelect(selectedUserId);
        }
    }, [selectedUserId]);

    const handleUserSelect = async (id) => {
        try {
            if (!id) return;
            setEditingProfile(false);
            const user = await fetchUserById(id);
            setSelectedUser(user);
            setMessages([]);
            setSearchParams({ userId, selectedUserId: id });
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const handleSendMessage = () => {
        if (!message.trim()) return;
        setMessages([...messages, { user: "You", text: message }]);
        setMessage("");
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f4f6f8", margin: "auto", width: "100%" }}>
            {/* Sidebar */}
            <Box
                sx={{
                    width: 360,
                    borderRight: "1px solid #e0e0e0",
                    padding: 3,
                    bgcolor: "#ffffff",
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {/* Profile Section */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 3,
                        cursor: "pointer",
                        padding: 2,
                        borderRadius: 2,
                        bgcolor: "#f0f4ff",
                        "&:hover": {
                            bgcolor: "#d9e4ff",
                        },
                    }}
                    onClick={() => {
                        setEditingProfile(true);
                        setSelectedUser(null);
                    }}
                >
                    <Avatar
                        src={profileData.image_url && profileData.image_url.startsWith("data:image") ? profileData.image_url : ""}
                        sx={{
                            marginRight: 2,
                            width: 56,
                            height: 56,
                            border: "2px solid #3f51b5",
                        }}
                    />
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#333" }}>
                        {profileData.username || "User"}
                    </Typography>
                </Box>

                {/* Search Bar */}
                <TextField
                    label="Search Users"
                    variant="outlined"
                    fullWidth
                    sx={{
                        marginBottom: 3,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: 3,
                        },
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* User List */}
                <List
                    sx={{
                        flex: 1,
                        overflowY: "auto",
                        cursor: "pointer",
                        padding: 0,
                        bgcolor: "#fff",
                        borderRadius: 2,
                    }}
                >
                    {users
                        .filter((user) => user.username.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((user) => (
                            <ListItem
                                key={user.id}
                                button
                                onClick={() => handleUserSelect(user.id)}
                                sx={{
                                    borderBottom: "1px solid #f0f0f0",
                                    padding: 2,
                                    "&:hover": {
                                        bgcolor: "#e0f7fa",
                                    },
                                }}
                            >
                                <Avatar
                                    src={user.image_url && user.image_url.startsWith("data:image") ? user.image_url : ""}
                                    sx={{
                                        marginRight: 2,
                                        width: 48,
                                        height: 48,
                                        border: "1px solid #ddd",
                                    }}
                                />
                                <Typography sx={{ fontWeight: "500", color: "#333" }}>{user.username}</Typography>
                            </ListItem>
                        ))}

                </List>

                {/* Logout Button */}
                <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    sx={{
                        marginTop: 3,
                        fontWeight: "bold",
                        borderRadius: 2,
                        paddingY: 1.5,
                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                    }}
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>

            {/* Main Content */}
            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", padding: 3, bgcolor: "#ffffff" }}>
                {editingProfile ? (
                    <Paper
                        elevation={4}
                        sx={{
                            p: 6,
                            borderRadius: 4,
                            textAlign: "center",
                            maxWidth: 500,
                            margin: "auto",
                            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
                            bgcolor: "#f9fafc",
                        }}
                    >
                        <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: 3, color: "#333" }}>
                            Edit Profile
                        </Typography>

                        <Box sx={{ position: "relative", display: "inline-block", marginBottom: 3 }}>
                            <Avatar
                                src={profileData.image_url && profileData.image_url.startsWith("data:image") ? profileData.image_url : ""}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    margin: "auto",
                                    border: "3px solid #3f51b5",
                                }}
                            />
                            <IconButton
                                component="label"
                                sx={{
                                    position: "absolute",
                                    bottom: 5,
                                    right: 5,
                                    backgroundColor: "#3f51b5",
                                    color: "#fff",
                                    borderRadius: "50%",
                                    boxShadow: 3,
                                    "&:hover": {
                                        backgroundColor: "#303f9f",
                                    },
                                }}
                            >
                                <CameraAltIcon />
                                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                            </IconButton>
                        </Box>

                        {uploading && <CircularProgress size={32} sx={{ marginBottom: 3 }} />}

                        <TextField
                            fullWidth
                            label="Username"
                            name="username"
                            variant="outlined"
                            sx={{ marginBottom: 3 }}
                            value={profileData.username}
                            onChange={handleProfileChange}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            variant="outlined"
                            sx={{ marginBottom: 3 }}
                            value={profileData.email}
                            onChange={handleProfileChange}
                        />
                        <TextField
                            fullWidth
                            label="Old Password"
                            name="password"
                            type="password"
                            variant="outlined"
                            sx={{ marginBottom: 3 }}
                            value={profileData.old_password}
                            onChange={handleProfileChange}
                        />
                        <TextField
                            fullWidth
                            label="New Password"
                            name="password"
                            type="password"
                            variant="outlined"
                            sx={{ marginBottom: 3 }}
                            value={profileData.new_password}
                            onChange={handleProfileChange}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleProfileUpdate}
                            sx={{
                                fontWeight: "bold",
                                paddingY: 1.5,
                                borderRadius: 3,
                                "&:hover": {
                                    backgroundColor: "#303f9f",
                                },
                            }}
                        >
                            Update Profile
                        </Button>
                    </Paper>
                ) : selectedUser ? (
                    <>
                        <Typography variant="h6" sx={{ paddingBottom: 2, borderBottom: "1px solid #ddd" }}>
                            Chat with {selectedUser.username}
                        </Typography>
                        <List sx={{ flex: 1, overflowY: "auto", paddingY: 2 }}>
                            {messages.map((msg, index) => (
                                <ListItem key={index}>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                                            {msg.user}
                                        </Typography>
                                        <Typography variant="body1">{msg.text}</Typography>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                        <Divider />
                        <Box sx={{ display: "flex", alignItems: "center", marginTop: 2 }}>
                            <TextField
                                label="Type a message"
                                fullWidth
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                sx={{ marginRight: 2 }}
                            />
                            <Button variant="contained" color="primary" onClick={handleSendMessage}>
                                Send
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Typography variant="h6">Select a user to start chatting</Typography>
                )}
            </Box>
        </Box>
    );
};

export default ChatPage;


