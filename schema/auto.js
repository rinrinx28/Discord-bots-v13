const mongoose = require("mongoose");

const auto = new mongoose.Schema({
  autocheck: { type: Boolean, default: false },
  guilid: { type: String, default: "1034209710930415729" },
  logs: String,
});

module.exports = mongoose.model("Event Autos", auto, "Event Autos");
