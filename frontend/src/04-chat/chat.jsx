import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, TextField, Button, Avatar, Typography, Divider } from '@mui/material';
import { fetchUsers, fetchUserById } from '../api';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ChatPage = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Get userId and selectedUserId from URL query params
    const userId = searchParams.get('userId');
    const selectedUserId = searchParams.get('selectedUserId');

    const loggedInUser = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!loggedInUser) {
            navigate('/login');
        }
    }, [navigate, loggedInUser]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const userList = await fetchUsers();
                setUsers(userList);
            } catch (error) {
                console.error('Error loading users:', error);
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
            const user = await fetchUserById(id);
            setSelectedUser(user);
            setMessages([]);

            // Update query params without changing the path
            setSearchParams({ userId, selectedUserId: id });
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const handleSendMessage = () => {
        if (!message.trim()) return;
        setMessages([...messages, { user: 'You', text: message }]);
        setMessage('');
    };

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    return (
        <>
            <Box sx={{ display: 'flex', height: '98vh', bgcolor: '#f4f4f4', margin: 'auto', width: '98%' }}>
                {/* Sidebar */}
                <Box sx={{ width: 320, borderRight: '1px solid #ddd', padding: 2, bgcolor: '#fff', boxShadow: 2, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                        <Avatar src={loggedInUser?.image_url} sx={{ marginRight: 2, width: 48, height: 48 }} />
                        <Typography variant="h6">{loggedInUser?.username || 'User'}</Typography>
                    </Box>
                    <TextField
                        label="Search Users"
                        variant="outlined"
                        fullWidth
                        sx={{ marginBottom: 2 }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <List sx={{ flex: 1, overflowY: 'auto', cursor: 'pointer' }}>
                        {users.filter(user => user.username.toLowerCase().includes(searchTerm.toLowerCase())).map(user => (
                            <ListItem key={user.id} button onClick={() => handleUserSelect(user.id)} sx={{ borderRadius: 2, '&:hover': { bgcolor: '#f0f0f0' } }}>
                                <Avatar src={user.image_url} sx={{ marginRight: 2 }} />
                                <Typography>{user.username}</Typography>
                            </ListItem>
                        ))}
                    </List>
                    <Button variant="outlined" color="error" sx={{ marginTop: 2 }} onClick={handleLogout}>Logout</Button>
                </Box>

                {/* Chat Area */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 3, bgcolor: '#fff', boxShadow: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {selectedUser ? (
                        <>
                            <Typography variant="h6" sx={{ paddingBottom: 2, borderBottom: '1px solid #ddd', alignSelf: 'flex-start' }}>
                                Chat with {selectedUser.username}
                            </Typography>
                            <List sx={{ flex: 1, overflowY: 'auto', paddingY: 2, width: '100%' }}>
                                {messages.map((msg, index) => (
                                    <ListItem key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                                        <Avatar sx={{ marginRight: 2 }} />
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                {msg.user}
                                            </Typography>
                                            <Typography variant="body1">{msg.text}</Typography>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                            <Divider />
                            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2, width: '100%' }}>
                                <TextField
                                    label="Type a message"
                                    variant="outlined"
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
                        <Typography variant="h6" sx={{ textAlign: 'center' }}>
                            Select a user to start chatting
                        </Typography>
                    )}
                </Box>
            </Box>
        </>
    );
};

export default ChatPage;
