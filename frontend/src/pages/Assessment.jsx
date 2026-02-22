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

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      return alert("Please answer all questions");
    }

    try {
      setSubmitting(true);
      await submitAssessmentAnswers(goalId, answers);
      navigate("/dashboard");
    } catch (err) {
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
      <div className="assessment-card">
        <h2>🧠 Quick Assessment</h2>
        <p className="subtitle">
          Answer a few questions so the AI can personalize your roadmap
        </p>

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
              onChange={(e) =>
                handleChange(q.question, e.target.value)
              }
            />
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
