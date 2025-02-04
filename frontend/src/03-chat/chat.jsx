import React, { useState } from 'react';
import { Box, List, ListItem, TextField, Button, Avatar, Typography, Divider } from '@mui/material';

const ChatPage = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { user: 'User1', text: 'Hello!' },
        { user: 'User2', text: 'Hi there!' },
    ]);

    const handleSendMessage = () => {
        setMessages([...messages, { user: 'You', text: message }]);
        setMessage('');
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: 2 }}>
            <Typography variant="h6">Chat with User</Typography>
            <List sx={{ flex: 1, overflowY: 'auto' }}>
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
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                    label="Type a message"
                    variant="outlined"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    fullWidth
                />
                <Button variant="contained" color="primary" onClick={handleSendMessage}>
                    Send
                </Button>
            </Box>
        </Box>
    );
};

export default ChatPage;
