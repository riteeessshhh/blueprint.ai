const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  goalId: mongoose.Schema.Types.ObjectId,
  title: String,
  day: String,
  status: { type: String, default: "pending" }
});

module.exports = mongoose.model("Task", taskSchema);
