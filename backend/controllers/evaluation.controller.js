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
  "goalType": "interview | project | college",
  "backgroundSummary": "A concise 1-sentence summary of what the user already knows (e.g., 'User already knows C++, OOP, and DSA, but is new to JS')"
}
`;

    let profile;

    try {
      const output = await callLLM(prompt);
      profile = extractJSON(output);
    } catch (err) {
      // 🔁 FALLBACK — handles both API failures (rate limits, network) and JSON parse errors
      console.warn("Evaluation LLM failed, using fallback profile:", err.message);
      profile = {
        level: "beginner",
        mathStrength: "low",
        learningStyle: "practical",
        goalType: "college",
        backgroundSummary: "Absolute beginner with no prior experience specified."
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
