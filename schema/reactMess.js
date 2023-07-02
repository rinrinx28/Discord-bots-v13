const mongoose = require("mongoose");

const react_mess = new mongoose.Schema({
  reactId: String,
  messageID: String,
  channelID: String,
  guildId: { type: String, require: true },
});

module.exports = mongoose.model("Mess React Data", react_mess);
