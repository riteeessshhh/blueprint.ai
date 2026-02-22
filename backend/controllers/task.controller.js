const Task = require("../models/Task");
const Memory = require("../models/Memory");

exports.taskAction = async (req, res) => {
  const { action } = req.body;
  const task = await Task.findById(req.params.taskId);
  const memory = await Memory.findOne({ goalId: task.goalId });

  if (action === "done") {
    task.status = "done";
    memory.completedTasks.push(task.title);
  }

  if (action === "skip") {
    task.status = "skipped";
    memory.skippedTasks.push(task.title);
  }

  await task.save();
  await memory.save();

  res.json({ message: "Task updated", task });
};
