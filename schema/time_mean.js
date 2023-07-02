// Create schema with time mean
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const time_mean = new Schema({
  timerate: String,
  idRole: String,
});
module.exports = mongoose.model("time_mean", time_mean);
