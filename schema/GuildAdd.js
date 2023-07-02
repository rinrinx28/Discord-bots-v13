const mongoose = require("mongoose");

const guildEvents = new mongoose.Schema({
  guildId: { type: String, require: true },
  chLog: { type: String, require: true },
  ch_join: { type: String, require: true },
  ch_leave: { type: String, require: true },
  role: { type: String },
});

module.exports = mongoose.model("GuildEvents", guildEvents, "GuildEvents");
