const mongoose = require("mongoose");

const voicelog = new mongoose.Schema({
  guildId: { type: String, require: true },
  chLog: { type: String, require: true },
  j2t: { type: String, require: true },
  parentj2t: { type: String, require: true },
});

module.exports = mongoose.model("Voicelog", voicelog, "Voicelog");
