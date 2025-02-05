import React from 'react';
import { Button } from '@mui/material';
import { Link } from 'react-router-dom'; 

const Home = () => {
    return (
        <div>
            <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button variant="contained" sx={{ marginRight: 2 }}>Login</Button>
            </Link>
            <Link to="/signup" style={{ textDecoration: 'none' }}>
                <Button variant="outlined">Sign up</Button>
            </Link>
        </div>
    );
};

export default Home;
