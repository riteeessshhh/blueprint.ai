import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar glass-panel">
      <Link to="/" className="nav-logo">
        🚀 Blueprint.ai
      </Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/profile" className="nav-link">My Roadmaps</Link>
            <button onClick={handleLogout} className="nav-btn logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/signup" className="nav-btn">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
