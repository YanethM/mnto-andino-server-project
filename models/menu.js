const mongoose = require("mongoose");

const MenuSchema = mongoose.Schema({
  title: String,
  path: String,
  order: Number,
  active: Boolean,
  icon: String,
});

module.exports = mongoose.model("Menu", MenuSchema);
