const mongoose = require("mongoose");

const subtaskSchema = new mongoose.Schema({
  hour: String,
  activity: String,
  completed: { type: Boolean, default: false }
});

const taskSchema = new mongoose.Schema({
  goalId: mongoose.Schema.Types.ObjectId,
  title: String,
  day: String,
  status: { type: String, default: "pending" },
  subtasks: [subtaskSchema]
});

module.exports = mongoose.model("Task", taskSchema);
