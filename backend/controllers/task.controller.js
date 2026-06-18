const Task = require("../models/Task");

exports.toggleSubtask = async (req, res) => {
  try {
    const { taskId, subtaskId } = req.params;
    
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const subtask = task.subtasks.id(subtaskId);
    if (!subtask) return res.status(404).json({ error: "Subtask not found" });

    subtask.completed = !subtask.completed;
    await task.save();

    res.json(task);
  } catch (error) {
    console.error("Failed to toggle subtask", error);
    res.status(500).json({ error: "Failed to toggle subtask" });
  }
};
