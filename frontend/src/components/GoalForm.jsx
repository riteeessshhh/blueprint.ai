import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createGoal } from "../api/agent";
import "./GoalForm.css";

function GoalForm() {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");
  const [finalGoal, setFinalGoal] = useState("");
  const [days, setDays] = useState(7);
  const [dailyHours, setDailyHours] = useState(3);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [placeholder1, setPlaceholder1] = useState("e.g., Machine Learning");
  const [placeholder2, setPlaceholder2] = useState("e.g., Pass my biology exam");

  useEffect(() => {
    if (step === 1) {
      const p1 = [
        "e.g., Machine Learning",
        "e.g., Acoustic Guitar",
        "e.g., Half-Marathon",
        "e.g., Italian Cooking",
        "e.g., Public Speaking"
      ];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % p1.length;
        setPlaceholder1(p1[i]);
      }, 2500);
      return () => clearInterval(interval);
    } else if (step === 2) {
      const p2 = [
        "e.g., Pass my biology exam",
        "e.g., Learn to play acoustic guitar",
        "e.g., Train for a half-marathon",
        "e.g., Prepare for a FAANG interview",
        "e.g., Build a personal portfolio"
      ];
      let i = 0;
      const interval = setInterval(() => {
        i = (i + 1) % p2.length;
        setPlaceholder2(p2[i]);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [step]);

  const nextStep = () => {
    if (step === 1 && !goal.trim()) return alert("Please enter a topic to master.");
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const submitHandler = async () => {
    try {
      setLoading(true);

      const res = await createGoal({
        title: goal,
        days: Number(days),
        dailyHours: Number(dailyHours),
        finalGoal: finalGoal
      });

      localStorage.setItem("goalId", res.data._id);
      localStorage.setItem("goal", goal);

      navigate("/assessment");
    } catch (err) {
      console.error("Failed to create goal", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="goal-container">
      <div className="goal-card glass-panel">
        <div className="goal-header">
          <span className="goal-icon">🤖</span>
          <h2>Design Your Roadmap</h2>
          <p className="subtitle">
            {step === 1 && "What do you want to master?"}
            {step === 2 && "What is your ultimate goal?"}
            {step === 3 && "How much time can you commit?"}
          </p>
        </div>

        <div className={`step-container step-${step}`}>
          {step === 1 && (
            <div className="input-wrapper fade-in">
              <span className="input-icon">🎯</span>
              <input
                className="goal-input"
                placeholder={placeholder1}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                autoFocus
              />
            </div>
          )}

          {step === 2 && (
            <div className="final-goal-wrapper fade-in">
              <input
                className="goal-input"
                placeholder={placeholder2}
                value={finalGoal}
                onChange={(e) => setFinalGoal(e.target.value)}
                autoFocus
              />
            </div>
          )}

          {step === 3 && (
            <div className="timeline-inputs fade-in">
              <div className="input-group">
                <label>Days to completion:</label>
                <input 
                  type="number" 
                  min="1"
                  className="goal-input small" 
                  value={days} 
                  onChange={(e) => setDays(e.target.value)} 
                />
              </div>
              <div className="input-group">
                <label>Hours per day:</label>
                <input 
                  type="number" 
                  min="1"
                  max="24"
                  className="goal-input small" 
                  value={dailyHours} 
                  onChange={(e) => setDailyHours(e.target.value)} 
                />
              </div>
            </div>
          )}
        </div>

        <div className="wizard-controls">
          {step > 1 && (
            <button className="goal-btn secondary" onClick={prevStep} disabled={loading}>
              Back
            </button>
          )}
          
          {step < 3 ? (
            <button className="goal-btn" onClick={nextStep}>
              Next Step ➔
            </button>
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}

export default GoalForm;
