const mongoose = require("mongoose");

const test = new mongoose.Schema({
  value: { type: [String] },
});

module.exports = mongoose.model("Test", test, "Test");
