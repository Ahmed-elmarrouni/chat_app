import React, { useState } from 'react';
import { TextField, Button, Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login } from '../api';

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
        <Card sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
            <CardContent>
                <Typography variant="h5" component="div" sx={{ marginBottom: 2 }}>
                    Login
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
                <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    type="email"
                    sx={{ marginBottom: 2 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="Password"
                    variant="outlined"
                    type="password"
                    sx={{ marginBottom: 2 }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
                    Login
                </Button>
            </CardContent>
        </Card>
    );
};

export default Login;
