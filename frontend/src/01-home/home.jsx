
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f4f6f8",
                textAlign: "center",
                padding: 3,
            }}
        >
            {/* Hero Section */}
            <Box
                sx={{
                    maxWidth: 600,
                    marginBottom: 4,
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: "bold",
                        color: "#1976d2",
                        marginBottom: 2,
                    }}
                >
                    Welcome to ChatApp
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: "#555",
                        marginBottom: 4,
                    }}
                >
                    Connect with your friends and family seamlessly. Sign up to get started or log in if you already have an
                    account. Enjoy a fast, secure, and reliable chat experience!
                </Typography>
            </Box>

            {/* Buttons */}
            <Box>
                <Link to="/login" style={{ textDecoration: "none" }}>
                    <Button
                        variant="contained"
                        size="large"
                        sx={{
                            marginRight: 2,
                            bgcolor: "#1976d2",
                            color: "#fff",
                            paddingX: 4,
                            paddingY: 1.5,
                            borderRadius: 3,
                            "&:hover": {
                                bgcolor: "#1565c0",
                            },
                        }}
                    >
                        Login
                    </Button>
                </Link>
                <Link to="/signup" style={{ textDecoration: "none" }}>
                    <Button
                        variant="outlined"
                        size="large"
                        sx={{
                            color: "#1976d2",
                            borderColor: "#1976d2",
                            paddingX: 4,
                            paddingY: 1.5,
                            borderRadius: 3,
                            "&:hover": {
                                bgcolor: "#e3f2fd",
                            },
                        }}
                    >
                        Sign Up
                    </Button>
                </Link>
            </Box>
        </Box>
    );
};

export default Home;
