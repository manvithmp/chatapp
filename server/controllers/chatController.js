const Message = require("../models/Message");

exports.getMessages = async (req, res) => {
  const { user, target } = req.query;

  try {
    const messages = await Message.find({
      $or: [
        { sender: user, recipient: target },
        { sender: target, recipient: user }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
