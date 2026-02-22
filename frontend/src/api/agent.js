import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

/* ---------------- EXISTING (same) ---------------- */

// 1️⃣ Goal create
export const createGoal = (data) => API.post("/goal", data);

// 4️⃣ Final roadmap generate (assessment ke baad)
export const generatePlan = (goalId) => API.post(`/plan/${goalId}`);

// (optional – agar old system use karo)
export const taskAction = (taskId, action) =>
  API.post(`/task/${taskId}`, { action });

export const replan = (goalId) => API.post(`/replan/${goalId}`);


/* ---------------- NEW: ASSESSMENT FLOW ---------------- */

// 2️⃣ AI se assessment questions lo
export const getAssessmentQuestions = (goalId) =>
  API.post(`/questions/${goalId}`);

// 3️⃣ User ke answers bhejo (evaluation + profiling)
export const submitAssessmentAnswers = (goalId, answers) =>
  API.post(`/answers/${goalId}`, { answers });
