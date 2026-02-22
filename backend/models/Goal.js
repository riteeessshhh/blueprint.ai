const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  title: String,
  days: Number,
  dailyHours: Number,
  status: { type: String, default: "active" }
});

module.exports = mongoose.model("Goal", goalSchema);
