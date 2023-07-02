const mongoose = require("mongoose");

const logsguild = new mongoose.Schema({
  guilid: { type: String, require: true },
  logstype: { type: String, require: true },
  channellogs: { type: String, require: true },
});

module.exports = mongoose.model("Logs Guild", logsguild);
