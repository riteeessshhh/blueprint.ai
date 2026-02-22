const UserProfile = require("../models/UserProfile");
const callLLM = require("../services/llm.service");
const extractJSON = require("../utils/jsonExtractor");

exports.evaluateAnswers = async (req, res) => {
  try {
    const answers = JSON.stringify(req.body.answers);

    const prompt = `
You are an AI evaluator agent.

User answers:
${answers}

Your task:
Infer the user's profile.

Rules (VERY IMPORTANT):
- Return ONLY valid JSON
- No explanation
- No markdown
- JSON must start with { and end with }

Required format:
{
  "level": "beginner | intermediate",
  "mathStrength": "low | medium | high",
  "learningStyle": "theory | practical",
  "goalType": "interview | project | college"
}
`;

    const output = await callLLM(prompt);

    let profile;

    try {
      profile = extractJSON(output);
    } catch (err) {
      // 🔁 FALLBACK (agent never breaks)
      profile = {
        level: "beginner",
        mathStrength: "low",
        learningStyle: "practical",
        goalType: "college"
      };
    }

    const saved = await UserProfile.create({
      goalId: req.params.goalId,
      ...profile
    });

    res.json(saved);

  } catch (error) {
    console.error("Evaluation Agent Error:", error);
    res.status(500).json({
      error: "Evaluation failed safely"
    });
  }
};
