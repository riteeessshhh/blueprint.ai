const Goal = require("../models/Goal");
const Memory = require("../models/Memory");

exports.createGoal = async (req, res) => {
  const { title, days, dailyHours } = req.body;

  const goal = await Goal.create({ title, days, dailyHours });
  await Memory.create({ goalId: goal._id, completedTasks: [], skippedTasks: [] });

  res.json(goal);
};
