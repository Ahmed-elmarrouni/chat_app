import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography, Box } from '@mui/material';
import { login } from '../api';
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();


    const handleLogin = async () => {
        try {
            const data = await login(email, password);
            console.log("Login data:", data);

            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate(`/chat?userId=${data.user.id}`);
            } else {
                setError("Invalid credentials");
            }
        } catch (error) {
            console.error("Error during login", error.response || error);
            setError(error.response ? error.response.data.message : "An error occurred. Please try again.");
        }
    };

    return (
        <>



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

                        {/* Email Input */}
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            type="email"
                            sx={{
                                marginBottom: 3,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                },
                            }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {/* Password Input */}
                        <TextField
                            fullWidth
                            label="Password"
                            variant="outlined"
                            type="password"
                            sx={{
                                marginBottom: 3,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                },
                            }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {/* Login Button */}
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleLogin}
                            sx={{
                                fontWeight: "bold",
                                paddingY: 1.5,
                                borderRadius: 2,
                                "&:hover": {
                                    backgroundColor: "#1565c0",
                                },
                            }}
                        >
                            Login
                        </Button>

                        {/* Link to Sign-Up */}
                        <Typography
                            variant="body2"
                            sx={{
                                marginTop: 2,
                                color: "#1976d2",
                            }}
                        >
                            Don't have an account?{" "}
                            <Link
                                to="/signup"
                                style={{
                                    textDecoration: "none",
                                    color: "#1565c0",
                                    fontWeight: "bold",
                                }}
                            >
                                Sign up here
                            </Link>
                        </Typography>
                    </CardContent>
                </Card>

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

            </Box>



        </>
    );
};

export default Login;
