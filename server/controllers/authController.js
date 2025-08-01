const User = require("../models/User");


exports.registerUser = async (req, res) => {
  const { username, password, avatar } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const newUser = await User.create({ username, password, avatar });
    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      avatar: newUser.avatar
    });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user._id,
      username: user.username,
      avatar: user.avatar
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
