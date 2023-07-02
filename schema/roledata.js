const mongoose = require("mongoose");

const role_data = new mongoose.Schema({
  role: String,
  name: String,
  reactId: String,
  descripstion: String,
  emojiani: String,
  guildId: { type: String, require: true },
});

module.exports = mongoose.model("Role Data", role_data);
