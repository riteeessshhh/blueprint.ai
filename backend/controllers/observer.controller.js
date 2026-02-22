const callLLM = require("../services/llm.service");
const Task = require("../models/Task");
const Memory = require("../models/Memory");
const Goal = require("../models/Goal");

exports.replan = async (req, res) => {
    const goal = await Goal.findById(req.params.goalId);
    const memory = await Memory.findOne({ goalId: goal._id });

    if (memory.skippedTasks.length === 0) {
        return res.json({ message: "No replanning needed" });
    }

    const prompt = `
User skipped tasks: ${memory.skippedTasks.join(", ")}

Replan remaining tasks for goal:
${goal.title}

Rules:
- Adjust difficulty
- Return ONLY JSON
- Same format as before
`;

    const output = await callLLM(prompt);
    const newPlan = JSON.parse(output);

    await Task.deleteMany({ goalId: goal._id, status: "pending" });

    const tasks = await Task.insertMany(
        newPlan.map(t => ({ ...t, goalId: goal._id }))
    );

    res.json(tasks);
};
