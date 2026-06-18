import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserGoals } from "../api/agent";
import "./Profile.css";

function Profile() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const { data } = await getUserGoals();
        setGoals(data);
      } catch (err) {
        console.error("Failed to fetch goals", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGoals();
  }, []);

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h2>📂 My Roadmaps</h2>
        <p>Access and track all your generated goals here.</p>
      </div>

      {loading ? (
        <div className="profile-loading">Loading your roadmaps...</div>
      ) : (
        <div className="goals-grid">
          {goals.length === 0 ? (
            <div className="no-goals glass-panel">
              <p>You haven't saved any roadmaps yet.</p>
              <Link to="/" className="create-link">Create one now ➔</Link>
            </div>
          ) : (
            goals.map(goal => (
              <div key={goal._id} className="goal-card-mini glass-panel">
                <h3>{goal.title}</h3>
                <p className="goal-detail">{goal.days} Days • {goal.dailyHours} hrs/day</p>
                <div className="goal-actions">
                  <button 
                    className="view-btn"
                    onClick={() => {
                      localStorage.setItem("goalId", goal._id);
                      window.location.href = "/dashboard";
                    }}
                  >
                    Open Roadmap
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
