const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const initSocket = require("./socket");
const User = require("./models/User");

dotenv.config();

const app = express();
const server = http.createServer(app);

connectDB();
initSocket(server);

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);


const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  const user = await User.findOne({ username: "chat" });
  if (!user) {
    await User.create({
      username: "chat",
      password: "chat123",
      avatar: "https://i.pravatar.cc/150?u=chat"
    });
    console.log("👤 Default user 'chat' created");
  }
});


