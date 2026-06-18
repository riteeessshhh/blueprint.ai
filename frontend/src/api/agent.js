import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const parsed = JSON.parse(userInfo);
    if (parsed.token) {
      req.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return req;
});

/* ---------------- EXISTING (same) ---------------- */

// 1️⃣ Goal create & manage
export const createGoal = (data) => API.post("/goal", data);
export const getGoal = (goalId) => API.get(`/goal/${goalId}`);
export const getUserGoals = () => API.get("/goals/user");
export const updateGoal = (goalId, data) => API.put(`/goal/${goalId}`, data);

export const toggleSubtask = (taskId, subtaskId) => API.put(`/tasks/${taskId}/subtasks/${subtaskId}/toggle`);

// 4️⃣ Final roadmap generate (assessment ke baad)
export const generatePlan = (goalId, regenerate = false) =>
  API.post(`/plan/${goalId}${regenerate ? "?regenerate=true" : ""}`);


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
