const mongoose = require("mongoose");

const blacklist = new mongoose.Schema({
  guilid: { type: String },
  steamid: { type: String },
  name: { type: String },
  reason: { type: String },
  listname: { type: [String] },
  time: { type: String },
  times: { type: Number },
  authorid: { type: String },
});

module.exports = mongoose.model(
  "Event Blacklist",
  blacklist,
  "Event Blacklist",
);
