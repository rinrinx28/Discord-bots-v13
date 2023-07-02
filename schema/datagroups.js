const mongoose = require("mongoose");

const groups = new mongoose.Schema({
  guilid: String,
  type: String,
  name: String,
  cmds: { type: [String] },
  haucan: String,
});

module.exports = mongoose.model("Data Groups", groups);
