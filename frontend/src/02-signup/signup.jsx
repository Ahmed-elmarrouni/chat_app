import { TextField, Button, Card, CardContent, Typography } from '@mui/material';

function SignUp() {
    return (
        <Card sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
            <CardContent>
                <Typography variant="h5" component="div" sx={{ marginBottom: 2 }}>
                    Sign Up
                </Typography>
                <TextField fullWidth label="Username" variant="outlined" sx={{ marginBottom: 2 }} />
                <TextField fullWidth label="Email" variant="outlined" type="email" sx={{ marginBottom: 2 }} />
                <TextField fullWidth label="Password" variant="outlined" type="password" sx={{ marginBottom: 2 }} />
                <Button variant="contained" color="primary" fullWidth>
                    Sign Up
                </Button>
            </CardContent>
        </Card>
    );
}

export default SignUp;
