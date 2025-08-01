const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const User = require("../models/User");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get('/search', async (req, res) => {
  const { q, current } = req.query;
  try {
    const users = await User.find({
      username: { $regex: q, $options: 'i' },
      username: { $ne: current }
    }).select('username avatar');

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Search failed' });
  }
});

module.exports = router;
