const mongoose = require("mongoose");

const timeonline = new mongoose.Schema({
  guilid: { type: String },
  steamid: { type: String },
  name: { type: String },
  timein: { type: Number, default: 0 },
  timeout: { type: Number, default: 0 },
  timeonline: { type: Number, default: 0 },
});

module.exports = mongoose.model(
  "Event Time Online",
  timeonline,
  "Event Time Online",
);
