const router = require("express").Router();

const { createGoal } = require("../controllers/goal.controller");
const { generateQuestions } = require("../controllers/question.controller");
const { evaluateAnswers } = require("../controllers/evaluation.controller");
const { generatePlan } = require("../controllers/planner.controller");

router.post("/goal", createGoal);
router.post("/questions/:goalId", generateQuestions);
router.post("/answers/:goalId", evaluateAnswers);
router.post("/plan/:goalId", generatePlan);

module.exports = router;
