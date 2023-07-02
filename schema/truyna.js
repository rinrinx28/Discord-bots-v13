const mongoose = require("mongoose");

const truyna = new mongoose.Schema({
  guilid: { type: String },
  steamid: { type: String },
  name: { type: String },
  reason: { type: String },
  time: { type: String },
  authorid: { type: String },
  listname: { type: [String] },
});

module.exports = mongoose.model("Event Truy na", truyna, "Event Truy na");
