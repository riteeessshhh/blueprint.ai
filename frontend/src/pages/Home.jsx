import GoalForm from "../components/GoalForm";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="home-hero">
        <h1>🚀 Blueprint.ai</h1>
        <p>
          Turn any ambition into a highly detailed, hour-by-hour action plan
        </p>
      </div>
      <GoalForm />
    </div>
  );
}

export default Home;
