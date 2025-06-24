const express = require("express");
const connectDB = require("./config/database");
const http = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

const userRoutes = require("./routes/user");
const postRoutes = require("./routes/posts");
const indexRoutes = require("./routes/index");

app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/", indexRoutes);
app.use("/api/messages", messageRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin:["http://localhost:5173", "https://social-nest-nu.vercel.app/"], // frontend ka port
    methods: ["GET", "POST","PUT","DELETE"],
  },
});


const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("add_user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log("User online:", userId);
    io.emit("online_users", Array.from(onlineUsers.keys()));
  });

  socket.on("send_message", (data) => {
    console.log("Message received:", data);
    io.emit("receive_message", data);

    const recipientSocketId = onlineUsers.get(data.receiver);

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receive_message", data);
    }

    socket.emit("receive_message", data);
  });
  socket.on("typing", ({ conversationId, userId, isTyping }) => {
    const recipientSocketId = onlineUsers.get(
      conversationId.replace(userId, "").replace("_", "")
    );
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("user_typing", { userId, isTyping });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log("User went offline:", userId);
        io.emit("user_offline", userId);
        break;
      }
    }
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
