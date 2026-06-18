import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { updateGoal } from "../api/agent";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.get("save") === "true") {
        const goalId = localStorage.getItem("goalId");
        if (goalId && user && user._id) {
          await updateGoal(goalId, { userId: user._id });
        }
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <h2>Welcome Back</h2>
        <p>Login to access your saved roadmaps</p>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email Address" 
            className="auth-input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="auth-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-btn">Log In</button>
        </form>

        <Link to="/signup" className="auth-link">
          Don't have an account? <span>Sign up</span>
        </Link>
      </div>
    </div>
  );
}

export default Login;
