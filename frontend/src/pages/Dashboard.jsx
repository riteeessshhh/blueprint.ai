import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";
import TaskList from "../components/TaskList";
import { generatePlan, replan, getGoal, updateGoal } from "../api/agent";
import { AuthContext } from "../context/AuthContext";
import "./Dashboard.css";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [goalData, setGoalData] = useState(null);
  const [customizing, setCustomizing] = useState(false);
  const [formData, setFormData] = useState({
    title: "", finalGoal: "", days: 7, dailyHours: 3, additionalInstructions: ""
  });

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const goalId = localStorage.getItem("goalId");

  useEffect(() => {
    const fetchGoalAndPlan = async () => {
      try {
        const [goalRes, planRes] = await Promise.all([
          getGoal(goalId),
          generatePlan(goalId)
        ]);
        setGoalData(goalRes.data);
        setFormData({
          title: goalRes.data.title || "",
          finalGoal: goalRes.data.finalGoal || "",
          days: goalRes.data.days || 7,
          dailyHours: goalRes.data.dailyHours || 3,
          additionalInstructions: goalRes.data.additionalInstructions || ""
        });
        setTasks(planRes.data);
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGoalAndPlan();
  }, [goalId]);

  const handleReplan = async () => {
    const res = await replan(goalId);
    if (Array.isArray(res.data)) {
      setTasks(res.data);
    }
  };

  const handleRegenerate = async () => {
    try {
      setLoading(true);
      setCustomizing(false);
      await updateGoal(goalId, formData);
      const planRes = await generatePlan(goalId, true);
      setTasks(planRes.data);
      setGoalData(prev => ({ ...prev, ...formData }));
      localStorage.setItem("goal", formData.title);
    } catch (err) {
      console.error("Failed to regenerate plan", err);
      alert("Failed to regenerate plan");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRoadmap = async () => {
    if (!user) {
      navigate("/signup?save=true");
      return;
    }
    try {
      await updateGoal(goalId, { userId: user._id });
      setGoalData(prev => ({ ...prev, userId: user._id }));
      alert("Roadmap saved to your profile!");
    } catch (err) {
      console.error("Failed to save roadmap", err);
    }
  };

  const [generatingPdf, setGeneratingPdf] = useState(false);

  const downloadPDF = async () => {
    setGeneratingPdf(true);
    
    // 1. Get original container
    const originalContainer = document.getElementById("roadmap-container");
    
    // 2. Create a temporary wrapper in the DOM to ensure styles are physically applied
    const wrapper = document.createElement("div");
    wrapper.style.position = "absolute";
    wrapper.style.top = "0";
    wrapper.style.left = "-9999px"; // Hide from user
    wrapper.style.width = "800px"; // Fixed width for consistent PDF layout
    wrapper.style.backgroundColor = "#090a0f"; // PURE SOLID BLACK/BLUE BACKGROUND
    wrapper.style.color = "#ffffff";
    wrapper.style.padding = "30px";
    wrapper.style.boxSizing = "border-box";
    
    // 3. Clone the roadmap into the wrapper
    const clone = originalContainer.cloneNode(true);
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);
    
    // 4. Manually strip all transparency from the cloned elements
    const originalElements = originalContainer.querySelectorAll("*");
    const clonedElements = clone.querySelectorAll("*");
    
    for (let i = 0; i < originalElements.length; i++) {
      const orig = originalElements[i];
      const cln = clonedElements[i];
      const computedBg = window.getComputedStyle(orig).backgroundColor;
      
      // Force TaskCard to solid dark gray
      if (computedBg.includes("31, 41, 55") || computedBg.includes("rgba(31, 41, 55")) {
        cln.style.backgroundColor = "#1f2937";
        cln.style.backdropFilter = "none";
      } 
      // Force Subtasks to solid darker gray
      else if (computedBg.includes("17, 24, 39") || computedBg.includes("rgba(17, 24, 39")) {
        cln.style.backgroundColor = "#111827";
      }
      // Force top message banner to solid blue
      else if (computedBg.includes("59, 130, 246") || computedBg.includes("rgba(59, 130, 246")) {
        cln.style.backgroundColor = "#1e3a8a";
      }
      
      // Hide checkboxes to make PDF clean
      if (cln.tagName === "INPUT" && cln.type === "checkbox") {
        cln.style.display = "none";
      }
    }
    
    // 5. Generate PDF from the explicitly styled hidden wrapper
    const opt = {
      margin: 10,
      filename: `Blueprint_${goalData?.title?.replace(/\s+/g, '_') || 'Roadmap'}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        backgroundColor: '#090a0f', // Fallback
        logging: false 
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    try {
      await html2pdf().set(opt).from(wrapper).save();
    } catch (err) {
      console.error("PDF generation failed", err);
    } finally {
      document.body.removeChild(wrapper);
      setGeneratingPdf(false);
    }
  };

  const isSaved = !!goalData?.userId;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>🎯 Your Goal</h2>
        <p className="goal-text">{goalData?.title || "Loading..."}</p>
        
        {!loading && (
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
            <button 
              className="customize-toggle-btn"
              onClick={() => setCustomizing(!customizing)}
              style={{ marginTop: 0 }}
              disabled={generatingPdf}
            >
              {customizing ? "Close Customization" : "⚙️ Customize Roadmap"}
            </button>
            <button 
              className="customize-toggle-btn"
              onClick={downloadPDF}
              style={{ marginTop: 0, background: 'rgba(192, 132, 252, 0.15)', borderColor: '#c084fc', color: '#fff' }}
              disabled={generatingPdf}
            >
              {generatingPdf ? "Generating..." : "📥 Download PDF"}
            </button>
            {!isSaved && (
              <button 
                className="customize-toggle-btn"
                onClick={handleSaveRoadmap}
                style={{ marginTop: 0, background: 'rgba(16, 185, 129, 0.15)', borderColor: '#10b981', color: '#fff' }}
                disabled={generatingPdf}
              >
                💾 Save Roadmap
              </button>
            )}
          </div>
        )}
      </div>

      {customizing && !loading && (
        <div className="customize-panel glass-panel">
          <div className="customize-grid">
            <div className="cust-input-group">
              <label>Topic / Subject</label>
              <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="cust-input-group">
              <label>Final Goal</label>
              <input value={formData.finalGoal} onChange={e => setFormData({...formData, finalGoal: e.target.value})} />
            </div>
            <div className="cust-input-group">
              <label>Days</label>
              <input type="number" min="1" value={formData.days} onChange={e => setFormData({...formData, days: e.target.value})} />
            </div>
            <div className="cust-input-group">
              <label>Hours/Day</label>
              <input type="number" min="1" max="24" value={formData.dailyHours} onChange={e => setFormData({...formData, dailyHours: e.target.value})} />
            </div>
          </div>
          
          <div className="cust-input-group full-width">
            <label>Additional Instructions (Optional)</label>
            <textarea 
              placeholder="e.g., Make it more practical, focus heavily on interview questions, etc."
              value={formData.additionalInstructions} 
              onChange={e => setFormData({...formData, additionalInstructions: e.target.value})} 
            />
          </div>

          <button className="regenerate-btn" onClick={handleRegenerate}>
            ✨ Regenerate Roadmap
          </button>
        </div>
      )}

      {loading ? (
        <div className="dashboard-loading">
          🤖 AI is building your daily plan...
        </div>
      ) : (
        <div 
          className="dashboard-content" 
          id="roadmap-container"
        >
          <TaskList
            tasks={tasks}
            setTasks={setTasks}
            onReplan={handleReplan}
            isSaved={isSaved}
          />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
