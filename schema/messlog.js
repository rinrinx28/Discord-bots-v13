const mongoose = require("mongoose");

const messlog = new mongoose.Schema({
  guildId: { type: String, require: true },
  chLog: { type: String, require: true },
});

module.exports = mongoose.model("Messlog", messlog, "Messlog");
