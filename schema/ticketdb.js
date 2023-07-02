const mongoose = require("mongoose");

const ticketdb = new mongoose.Schema({
  guildId: { type: String, require: true },
  chLog: { type: String, require: true },
});

module.exports = mongoose.model("Ticketdb", ticketdb, "Ticketdb");
