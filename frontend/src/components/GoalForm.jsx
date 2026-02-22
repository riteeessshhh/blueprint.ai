import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createGoal } from "../api/agent";
import "./GoalForm.css";

function GoalForm() {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async () => {
    if (!goal) return alert("Enter a goal");

    try {
      setLoading(true);

      const res = await createGoal({
        title: goal,
        days: 7,
        dailyHours: 3
      });

      localStorage.setItem("goalId", res.data._id);
      localStorage.setItem("goal", goal);

      navigate("/assessment");
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="goal-container">
      <div className="goal-card">
        <div className="goal-header">
          <span className="goal-icon">🤖</span>
          <h2>AI Goal Planner</h2>
          <p className="subtitle">
            Describe your goal and let the agent plan it for you
          </p>
        </div>

        <div className="input-wrapper">
          <span className="input-icon">🎯</span>
          <input
            className="goal-input"
            placeholder="Finish ML syllabus in 7 days"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
        </div>

        <button
          className="goal-btn"
          onClick={submitHandler}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner" />
              Planning...
            </>
          ) : (
            "Generate AI Plan 🚀"
          )}
        </button>
      </div>
    </div>
  );
}

export default GoalForm;
