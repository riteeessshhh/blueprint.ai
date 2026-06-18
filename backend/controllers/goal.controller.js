const Goal = require("../models/Goal");
const Memory = require("../models/Memory");

exports.createGoal = async (req, res) => {
  const { title, days, dailyHours, finalGoal } = req.body;
  
  const payload = { title, days, dailyHours, finalGoal };
  if (req.user) payload.userId = req.user;

  const goal = await Goal.create(payload);
  await Memory.create({ goalId: goal._id, completedTasks: [], skippedTasks: [] });

  res.json(goal);
};

exports.getUserGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user }).sort({ _id: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user goals" });
  }
};

exports.getGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.goalId);
    if (!goal) return res.status(404).json({ error: "Goal not found" });
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch goal" });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const { title, days, dailyHours, finalGoal, additionalInstructions } = req.body;
    
    const goal = await Goal.findByIdAndUpdate(
      req.params.goalId,
      { title, days, dailyHours, finalGoal, additionalInstructions },
      { new: true }
    );

    if (!goal) return res.status(404).json({ error: "Goal not found" });
    res.json(goal);
  } catch (error) {
    res.status(500).json({ error: "Failed to update goal" });
  }
};
