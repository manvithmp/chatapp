const { Server } = require("socket.io");
const Message = require("./models/Message");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("send_message", async (msg) => {
      try {
        const { sender, recipient, content, avatar } = msg;

        const newMsg = await Message.create({
          sender,
          recipient,
          content,
          avatar,
          timestamp: new Date()
        });

        io.emit("receive_message", newMsg);
      } catch (err) {
        console.error("Socket message error:", err);
      }
    });

    socket.on("typing", ({ sender }) => {
      socket.broadcast.emit("display_typing", { sender });
    });

    socket.on("disconnect", () => {
      console.log(" Client disconnected");
    });
  });
};

module.exports = initSocket;
