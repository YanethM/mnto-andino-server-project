const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  email: {
    type: String,
    unique: true,
  },
  current_password: String,
  role: String,
  sede: String,
  active: Boolean,
  avatar: String,
});

module.exports = mongoose.model("User", UserSchema);
