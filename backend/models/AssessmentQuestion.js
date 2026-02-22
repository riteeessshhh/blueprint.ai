const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  goalId: mongoose.Schema.Types.ObjectId,
  question: String,
  type: String
});

module.exports = mongoose.model("AssessmentQuestion", schema);
