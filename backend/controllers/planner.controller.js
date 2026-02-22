const Task = require("../models/Task");
const UserProfile = require("../models/UserProfile");
const Goal = require("../models/Goal");
const callLLM = require("../services/llm.service");
const extractJSON = require("../utils/jsonExtractor");

/* ---------- helper: normalize plan ---------- */
function normalizePlan(plan) {
  return plan.map((item, index) => {
    let day = item.day;

    // ensure day is string
    if (typeof day === "number") {
      day = day.toString();
    }

    if (typeof day !== "string") {
      day = `${index + 1}`;
    }

    return {
      title: item.title || `Task ${index + 1}`,
      day,
      status: "pending"
    };
  });
}

exports.generatePlan = async (req, res) => {
  try {
    const goalId = req.params.goalId;

    /* 1️⃣ fetch goal + profile */
    const goal = await Goal.findById(goalId);
    const profile = await UserProfile.findOne({ goalId });

    if (!goal || !profile) {
      return res.status(404).json({
        error: "Goal or user profile not found"
      });
    }

    /* 2️⃣ dynamic + strict prompt */
    const prompt = `
You are an AI planning agent.

User wants to learn:
"${goal.title}"

User profile:
- Skill level: ${profile.level}
- Math strength: ${profile.mathStrength}
- Learning style: ${profile.learningStyle}
- Learning objective: ${profile.goalType}

Your task:
Create a day-wise learning roadmap tailored to this user and this goal.

VERY IMPORTANT RULES (follow strictly):
- Return ONLY valid JSON
- Do NOT add explanations
- Do NOT add headings or extra text
- JSON must start with [ and end with ]
- Day MUST be a STRING (example: "1", "2-3")
- Do NOT use math expressions like 2-3 without quotes
- Keep titles concise and beginner-friendly

STRICT FORMAT:
[
  {
    "title": "Topic name",
    "day": "1"
  }
]
`;

    /* 3️⃣ call LLM */
    const output = await callLLM(prompt);

    let plan;
    try {
      plan = extractJSON(output);
    } catch (err) {
      // 🔁 safe fallback (agent never dies)
      plan = [
        { title: `Introduction to ${goal.title}`, day: "1" },
        { title: "Core Concepts", day: "2-3" },
        { title: "Hands-on Practice", day: "4-5" },
        { title: "Mini Project", day: "6-7" }
      ];
    }

    /* 4️⃣ normalize shape */
    if (!Array.isArray(plan) && plan.roadmap) {
      plan = plan.roadmap;
    }

    if (!Array.isArray(plan)) {
      plan = [plan];
    }

    plan = normalizePlan(plan);

    /* 5️⃣ replace old tasks */
    await Task.deleteMany({ goalId });

    const tasks = await Task.insertMany(
      plan.map(t => ({
        goalId,
        title: t.title,
        day: t.day,
        status: t.status
      }))
    );

    res.json(tasks);

  } catch (error) {
    console.error("Planner Agent Error:", error);
    res.status(500).json({
      error: "Planning failed safely"
    });
  }
};
