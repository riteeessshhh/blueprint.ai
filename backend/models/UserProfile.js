const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  goalId: mongoose.Schema.Types.ObjectId,
  level: String,
  mathStrength: String,
  learningStyle: String,
  goalType: String,
  backgroundSummary: String
});

module.exports = mongoose.model("UserProfile", schema);
