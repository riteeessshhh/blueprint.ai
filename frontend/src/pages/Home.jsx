import GoalForm from "../components/GoalForm";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="home-hero">
        <h1>🧠 AI Task Planner Agent</h1>
        <p>
          Turn your long-term goals into a clear, actionable daily plan
        </p>

        <GoalForm />
      </div>
    </div>
  );
}

export default Home;
