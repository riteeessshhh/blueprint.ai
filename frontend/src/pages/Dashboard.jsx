import { useEffect, useState } from "react";
import TaskList from "../components/TaskList";
import { generatePlan, replan } from "../api/agent";
import "./Dashboard.css";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const goal = localStorage.getItem("goal");
  const goalId = localStorage.getItem("goalId");

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const res = await generatePlan(goalId);
        setTasks(res.data);
      } catch (err) {
        console.error("Error generating plan", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [goalId]);

  const handleReplan = async () => {
    const res = await replan(goalId);
    if (Array.isArray(res.data)) {
      setTasks(res.data);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>🎯 Your Goal</h2>
        <p className="goal-text">{goal}</p>
      </div>

      {loading ? (
        <div className="dashboard-loading">
          🤖 AI is building your daily plan...
        </div>
      ) : (
        <div className="dashboard-content">
          <TaskList
            tasks={tasks}
            setTasks={setTasks}
            onReplan={handleReplan}
          />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
