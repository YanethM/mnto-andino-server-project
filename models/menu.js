const mongoose = require("mongoose");

const MenuSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  path: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("Menu", MenuSchema);
