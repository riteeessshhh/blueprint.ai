const router = require("express").Router();

const { createGoal, getGoal, updateGoal, getUserGoals } = require("../controllers/goal.controller");
const { generateQuestions } = require("../controllers/question.controller");
const { evaluateAnswers } = require("../controllers/evaluation.controller");
const { generatePlan } = require("../controllers/planner.controller");
const { toggleSubtask } = require("../controllers/task.controller");
const { protect, protectOptional } = require("../middleware/auth.middleware");

router.post("/goal", protectOptional, createGoal);
router.get("/goals/user", protect, getUserGoals);
router.get("/goal/:goalId", getGoal);
router.put("/goal/:goalId", updateGoal);

router.post("/questions/:goalId", generateQuestions);
router.post("/answers/:goalId", evaluateAnswers);
router.post("/plan/:goalId", generatePlan);

router.put("/tasks/:taskId/subtasks/:subtaskId/toggle", protectOptional, toggleSubtask);

module.exports = router;
