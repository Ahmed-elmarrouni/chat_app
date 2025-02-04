import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button } from '@mui/material';
import Login from './01-login/login';
import SignUp from './02-signup/signup';
import Chat from './03-chat/chat';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <Link to="/login">
            <Button variant="contained">Login</Button>
          </Link>
          <Link to="/signup">
            <Button variant="outlined">Sign up</Button>
          </Link>
          <Link to="/chat">
            <Button variant="contained">Chat</Button>
          </Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
