const mongoose = require("mongoose");

const question = new mongoose.Schema({
  guildId: { type: String, require: true },
  question: { type: Array, default: [] },
});

module.exports = mongoose.model("Question", question);
