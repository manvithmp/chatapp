const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  avatar: {
    type: String,
    default: "https://i.pravatar.cc/150?u=default"
  }
});

module.exports = mongoose.model("User", userSchema);
