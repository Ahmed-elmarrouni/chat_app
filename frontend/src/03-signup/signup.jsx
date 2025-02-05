// import React, { useState } from "react";
// import { TextField, Button, Card, CardContent, Typography } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { createUser } from "../api"; // Import the function from api.js

// function SignUp() {
//     const [formData, setFormData] = useState({
//         username: "",
//         email: "",
//         password: "",
//         image_url: "",
//     });

//     const [error, setError] = useState("");
//     const navigate = useNavigate(); // React Router for navigation

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: value,
//         }));
//     };


//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");

//         try {
//             const response = await createUser(formData);
//             console.log("User created successfully!", response);

//             if (response.id) {
//                 navigate(`/chat/${response.id}`);
//             } else {
//                 setError("Signup successful, but user ID missing.");
//             }
//         } catch (error) {
//             setError("Failed to create account. Try again.");
//         }
//     };

//     return (
//         <Card sx={{ maxWidth: 400, margin: "auto", padding: 2 }}>
//             <CardContent>
//                 <Typography variant="h5" component="div" sx={{ marginBottom: 2 }}>
//                     Sign Up
//                 </Typography>

//                 {error && <Typography color="error">{error}</Typography>}

//                 <form onSubmit={handleSubmit}>
//                     <TextField
//                         fullWidth
//                         label="Username"
//                         name="username"
//                         variant="outlined"
//                         sx={{ marginBottom: 2 }}
//                         value={formData.username}
//                         onChange={handleChange}
//                     />
//                     <TextField
//                         fullWidth
//                         label="Email"
//                         name="email"
//                         type="email"
//                         variant="outlined"
//                         sx={{ marginBottom: 2 }}
//                         value={formData.email}
//                         onChange={handleChange}
//                     />
//                     <TextField
//                         fullWidth
//                         label="Password"
//                         name="password"
//                         type="password"
//                         variant="outlined"
//                         sx={{ marginBottom: 2 }}
//                         value={formData.password}
//                         onChange={handleChange}
//                     />
//                     <TextField
//                         fullWidth
//                         label="Image URL"
//                         name="image_url"
//                         variant="outlined"
//                         sx={{ marginBottom: 2 }}
//                         value={formData.image_url}
//                         onChange={handleChange}
//                     />
//                     <Button type="submit" variant="contained" color="primary" fullWidth>
//                         Sign Up
//                     </Button>
//                 </form>
//             </CardContent>
//         </Card>
//     );
// }

// export default SignUp;


import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createUser } from "../api"; // Import the function from api.js

function SignUp() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        image_url: "",
    });

    const [error, setError] = useState("");
    const navigate = useNavigate(); // React Router for navigation

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
                // ✅ Store user and token in localStorage
                localStorage.setItem("token", "mocked-jwt-token");  // Backend should return actual token
                localStorage.setItem("user", JSON.stringify(response.user));

                // ✅ Navigate to chat with userId in query params
                navigate(`/chat?userId=${response.user.id}`);
            } else {
                setError("Signup successful, but user ID missing.");
            }
        } catch (error) {
            setError("Failed to create account. Try again.");
        }
    };

    return (
        <Card sx={{ maxWidth: 400, margin: "auto", padding: 2 }}>
            <CardContent>
                <Typography variant="h5" component="div" sx={{ marginBottom: 2 }}>
                    Sign Up
                </Typography>

                {error && <Typography color="error">{error}</Typography>}

                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        variant="outlined"
                        sx={{ marginBottom: 2 }}
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        variant="outlined"
                        sx={{ marginBottom: 2 }}
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        variant="outlined"
                        sx={{ marginBottom: 2 }}
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <TextField
                        fullWidth
                        label="Image URL"
                        name="image_url"
                        variant="outlined"
                        sx={{ marginBottom: 2 }}
                        value={formData.image_url}
                        onChange={handleChange}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Sign Up
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

export default SignUp;
