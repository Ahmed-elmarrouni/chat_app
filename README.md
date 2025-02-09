# Chat App

## Overview

This project is a real-time chat application built with a Go backend, a React frontend, and PostgreSQL for message persistence. The application supports WebSocket communication for real-time messaging, JWT authentication for secure access, and a well-structured database to store user data and messages.

## My Next Steps

### Backend: Go

1. **Set up WebSocket Server using `gorilla/websocket`**  
   The `gorilla/websocket` library will be used to manage WebSocket connections for real-time messaging.
   
   - Install the `gorilla/websocket` library:
     ```bash
     go get github.com/gorilla/websocket
     ```

2. **Create a WebSocket Server in Go**

### Frontend: React

1. **Install `socket.io-client` for React**  
   Install the necessary library to handle WebSocket communication on the frontend.
   ```bash
   npm install socket.io-client
   ```

2. **Update the React Chat Component**  
   Modify the React chat component to establish WebSocket communication.

3. **Integrate Authentication with JWT**  
   Implement JWT authentication to secure user access.

### Database: PostgreSQL

1. **Message Persistence**  
   Create a database schema to store chat messages persistently.
   ```sql
   CREATE TABLE messages (
       id SERIAL PRIMARY KEY,
       sender_id INT REFERENCES users(id) ON DELETE CASCADE,
       receiver_id INT REFERENCES users(id) ON DELETE CASCADE,
       message_content TEXT NOT NULL,
       timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

## Key Learning Areas

- **WebSockets in Go**: Handle real-time communication using the `gorilla/websocket` package.
- **JWT Authentication**: Implement token-based authentication using JWT in Go.
- **Frontend WebSocket Handling in React**: Set up and manage WebSocket connections within a React component.
- **Message Persistence**: Learn to persist chat messages in PostgreSQL.

## Tools and Libraries

- **WebSocket Communication (Real-time Messaging)**: [gorilla/websocket](https://github.com/gorilla/websocket)
- **HTTP Server & Routing**: `gorilla/mux`, `net/http`, `chi`
- **JWT Authentication**: [dgrijalva/jwt-go](https://github.com/dgrijalva/jwt-go)
- **Working with Databases**: [lib/pq](https://github.com/lib/pq), [gorm](https://gorm.io)
- **Concurrent Programming in Go**: Goroutines and Channels
- **Error Handling & Logging**: `log`, [logrus](https://github.com/sirupsen/logrus)
- **Testing and Mocking**: [stretchr/testify](https://github.com/stretchr/testify), `testing`
- **Middleware & Security**: Implementing CORS

## Recent Updates

- **Backend**:  
  Refactored the database connection logic from a single connection (`pgx.Conn`) to a connection pool (`pgxpool.Pool`).  
  Moved the database connection setup into a separate `db.go` file for better modularity and improved connection management.

- **Frontend**:  
  Implemented user profile editing with image upload (Base64 encoding).  
  Added user search functionality in the chat list.  
  Enhanced login & signup UI design using Material-UI components.  
  Improved error handling and integrated local storage updates.

