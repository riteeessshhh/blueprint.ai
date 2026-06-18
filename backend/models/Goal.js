const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  title: String,
  days: Number,
  dailyHours: Number,
  finalGoal: String,
  additionalInstructions: { type: String, default: "" },
  status: { type: String, default: "active" }
});

module.exports = mongoose.model("Goal", goalSchema);
