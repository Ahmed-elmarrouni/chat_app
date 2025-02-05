import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography, Box } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { createUser } from "../api";

function SignUp() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        image_url: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await createUser(formData);
            console.log("User created successfully!", response);

            if (response.user && response.user.id) {
                // Store user and token in localStorage
                localStorage.setItem("token", "mocked-jwt-token");
                localStorage.setItem("user", JSON.stringify(response.user));

                navigate(`/chat?userId=${response.user.id}`);
            } else {
                setError("Signup successful, but user ID missing.");
            }
        } catch (error) {
            setError("Failed to create account. Try again.");
        }
    };

    return (
        <>
            {/* Back Button */}
            <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/")}
                sx={{
                    position: "absolute",
                    top: 20,
                    left: 20,
                    fontWeight: "bold",
                    paddingX: 2,
                    borderRadius: 2,
                }}
            >
                Back
            </Button>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    bgcolor: "#f4f6f8",
                }}
            >
                <Card
                    sx={{
                        maxWidth: 400,
                        width: "90%",
                        margin: "auto",
                        padding: 3,
                        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
                        borderRadius: 3,
                        textAlign: "center",
                    }}
                >
                    <CardContent>
                        {/* Logo Section */}
                        <Box sx={{ marginBottom: 3 }}>
                            <img
                                src="./public/dk.png"
                                alt="Logo"
                                style={{
                                    width: "100px",
                                    height: "100px",
                                }}
                            />
                        </Box>

                        {/* Error Message */}
                        {error && (
                            <Typography color="error" sx={{ marginBottom: 2, textAlign: "center" }}>
                                {error}
                            </Typography>
                        )}

                        {/* Sign Up Form */}
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Username"
                                name="username"
                                variant="outlined"
                                sx={{
                                    marginBottom: 3,
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                    },
                                }}
                                value={formData.username}
                                onChange={handleChange}
                            />

                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                variant="outlined"
                                sx={{
                                    marginBottom: 3,
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                    },
                                }}
                                value={formData.email}
                                onChange={handleChange}
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                variant="outlined"
                                sx={{
                                    marginBottom: 3,
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 2,
                                    },
                                }}
                                value={formData.password}
                                onChange={handleChange}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{
                                    fontWeight: "bold",
                                    paddingY: 1.5,
                                    borderRadius: 2,
                                    "&:hover": {
                                        backgroundColor: "#1565c0",
                                    },
                                }}
                            >
                                Sign Up
                            </Button>
                        </form>

                        {/* Link to Login Page */}
                        <Typography
                            variant="body2"
                            sx={{
                                marginTop: 2,
                                color: "#1976d2",
                            }}
                        >
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                style={{
                                    textDecoration: "none",
                                    color: "#1565c0",
                                    fontWeight: "bold",
                                }}
                            >
                                Login here
                            </Link>
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
}

export default SignUp;
