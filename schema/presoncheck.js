const mongoose = require("mongoose");

const person = new mongoose.Schema({
  steamid: String,
  discordid: String,
  level: Number,
  guilid: { type: String, default: "1034209710930415729" },
  timejoin: Number,
  timeleave: Number,
  timeonline: { type: Number, default: 0 },
  name: String,
  id: String,
});

module.exports = mongoose.model("event person checks", person);

/**
 * Level = 0 : Member
 * Level = 1 : QTV
 */
