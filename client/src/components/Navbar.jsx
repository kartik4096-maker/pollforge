import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="brand">🗳 PollForge</Link>
      <div className="nav-links">
        {user ? (
          <>
            <span className="nav-user">Hi, {user.username} 👋</span>
            <Link to="/create" className="btn-create">+ Create Poll</Link>
            <button onClick={() => { logout(); navigate('/'); }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-create">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}