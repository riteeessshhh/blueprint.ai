import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAssessmentQuestions,
  submitAssessmentAnswers
} from "../api/agent";
import "./Assessment.css";

function Assessment() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const goalId = localStorage.getItem("goalId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await getAssessmentQuestions(goalId);
        setQuestions(res.data);
      } catch (err) {
        console.error("Failed to load assessment questions", err);
        alert("Failed to load assessment questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [goalId]);

  const handleChange = (question, value) => {
    setAnswers(prev => ({
      ...prev,
      [question]: value
    }));
  };

  const handleSkip = async () => {
    const skippedAnswers = {};
    questions.forEach(q => {
      skippedAnswers[q.question] = "I don't know (Complete Beginner)";
    });
    setAnswers(skippedAnswers);

    try {
      setSubmitting(true);
      await submitAssessmentAnswers(goalId, skippedAnswers);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to submit answers", err);
      alert("Failed to submit answers");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      return alert("Please answer all questions");
    }

    try {
      setSubmitting(true);
      await submitAssessmentAnswers(goalId, answers);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to submit answers", err);
      alert("Failed to submit answers");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="assessment-loading">
        🤖 AI is preparing your assessment...
      </div>
    );
  }

  return (
    <div className="assessment-container">
      <div className="assessment-card glass-panel">
        <h2>🧠 Quick Assessment</h2>
        <p className="subtitle">
          Answer a few questions so the AI can personalize your roadmap
        </p>

        <button className="skip-btn" onClick={handleSkip} disabled={submitting}>
          {submitting ? "🤖 Generating Roadmap..." : "⏩ Skip Assessment (I'm a complete beginner)"}
        </button>

        {questions.map((q, index) => (
          <div key={index} className="question-card">
            <span className="question-index">
              Q{index + 1}
            </span>

            <p className="question-text">
              {q.question}
            </p>

            <input
              type="text"
              placeholder="Type your answer..."
              value={answers[q.question] || ""}
              onChange={(e) =>
                handleChange(q.question, e.target.value)
              }
            />
            <div className="dk-chip-container">
              <button
                className="dk-chip"
                onClick={() => handleChange(q.question, "I don't know")}
              >
                🤷‍♂️ I don't know
              </button>
            </div>
          </div>
        ))}

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? "Analyzing your answers..." : "Continue 🚀"}
        </button>
      </div>
    </div>
  );
}

export default Assessment;
