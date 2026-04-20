import { Link, useNavigate } from 'react-router-dom';
import { useAuth }           from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">🗳️ PollForge</Link>
      <div className="nav-links">
        {user ? (
          <>
            <span>Hi, {user.username}</span>
            <Link to="/create">Create Poll</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}