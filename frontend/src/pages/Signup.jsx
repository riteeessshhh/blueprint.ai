import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { updateGoal } from "../api/agent";
import "./Auth.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(email, password);
      
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
      console.error(err);
      alert(err.response?.data?.message || err.message || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <h2>Create Account</h2>
        <p>Start generating AI roadmaps today</p>
        
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
          <button type="submit" className="auth-btn">Sign Up</button>
        </form>

        <Link to="/login" className="auth-link">
          Already have an account? <span>Log in</span>
        </Link>
      </div>
    </div>
  );
}

export default Signup;
