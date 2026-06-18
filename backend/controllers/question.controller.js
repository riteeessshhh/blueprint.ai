const AssessmentQuestion = require("../models/AssessmentQuestion");
const Goal = require("../models/Goal"); // 👈 NEW
const callLLM = require("../services/llm.service");
const extractJSON = require("../utils/jsonExtractor");

exports.generateQuestions = async (req, res) => {
  try {
    // 1️⃣ Fetch goal from DB
    const goal = await Goal.findById(req.params.goalId);

    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }

    // 2️⃣ Dynamic prompt based on USER GOAL
    const prompt = `
You are an AI assessment agent.

User Profile & Constraints:
- Topic: "${goal.title}"
- Final Goal: "${goal.finalGoal || 'General Knowledge'}"
- Time Available: ${goal.days} days, ${goal.dailyHours} hours/day.

Your task:
Generate 5 assessment questions tailored specifically to their goal and strict timeline constraint.

VERY IMPORTANT RULES (follow strictly):
- Return ONLY valid JSON
- JSON must start with [ and end with ]
- ALL values must be STRINGS
- Question text MUST be inside double quotes
- Question type MUST be inside double quotes
- Do NOT omit quotes
- Do NOT add explanations or extra text

Allowed question types (as strings):
"yes_no"
"low_medium_high"
"beginner_intermediate_advanced"
"interview_project_college"

STRICT FORMAT (exactly like this):
[
  {
    "question": "Do you know Python?",
    "type": "yes_no"
  }
]
`;

    let questions;
    try {
      const output = await callLLM(prompt);
      questions = extractJSON(output);
    } catch (err) {
      // 🔁 SAFE FALLBACK — handles API failures (rate limit, 503) and JSON parse errors
      console.warn("Question LLM failed, using fallback questions:", err.message);
      questions = [
        { question: `Have you studied ${goal.title} before?`, type: "yes_no" },
        { question: "How would you rate your current skill level?", type: "beginner_intermediate_advanced" },
        { question: "How comfortable are you with math or logic?", type: "low_medium_high" },
        { question: "Do you prefer learning through theory or hands-on practice?", type: "yes_no" },
        { question: "What is your learning goal?", type: "interview_project_college" }
      ];
    }

    // 4️⃣ Replace old questions for this goal
    await AssessmentQuestion.deleteMany({ goalId: req.params.goalId });

    const saved = await AssessmentQuestion.insertMany(
      questions.map(q => ({
        goalId: req.params.goalId,
        question: q.question,
        type: q.type
      }))
    );

    res.json(saved);

  } catch (error) {
    console.error("Question Agent Error:", error);
    res.status(500).json({ error: "Failed to generate assessment questions" });
  }
};
