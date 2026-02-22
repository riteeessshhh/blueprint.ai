const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema({
  goalId: mongoose.Schema.Types.ObjectId,
  completedTasks: [String],
  skippedTasks: [String]
});

module.exports = mongoose.model("Memory", memorySchema);
