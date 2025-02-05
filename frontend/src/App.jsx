import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './02-login/login';
import SignUp from './03-signup/signup';
import Chat from './04-chat/chat';
import Home from './01-home/home';

function App() {
  let user = null;
  let token = localStorage.getItem('token');

  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch {
    user = null;
  }

  if (!token) {
    localStorage.removeItem('user'); //  user is cleared if token is missing
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
