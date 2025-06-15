const express = require("express");
const connectDB = require("./config/database");
const http = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");
const messageRoutes = require('./routes/messageRoutes'); // Add this line

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

// const server = createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     methods: ["GET", "POST"],
//   },
// });

// // const users = {};

// io.on("connection", (socket) => {
//   console.log("User Connected:", socket.id);

//   socket.on("user_connected", (userId) => {
//     users[userId] = socket.id;
//     io.emit("online_users", Object.keys(users));
//   });

//   socket.on("send_message", (data) => {
//     console.log("Message Received:", data);
//     const { receiver } = data;

//     if (receiver && users[receiver]) {
//       io.to(users[receiver]).emit("receive_message", data);
//     } else {
//       io.emit("receive_message", data);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("User Disconnected:", socket.id);
//     for (const userId in users) {
//       if (users[userId] === socket.id) {
//         delete users[userId];
//         break;
//       }
//     }
//     io.emit("online_users", Object.keys(users));
//   });
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // frontend ka port
    methods: ['GET', 'POST']
  }
});

// Store online users with their socket IDs and user IDs
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Add user to online users when they connect
  socket.on('add_user', (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log('User online:', userId);
    io.emit('online_users', Array.from(onlineUsers.keys()));
  });

  // Handle sending messages
  socket.on('send_message', (data) => {
    console.log('Message received:', data);
    io.emit("receive_message", data);

    
    // Save the message to the database (handled by the API)
    // Then emit to the specific recipient if online
    const recipientSocketId = onlineUsers.get(data.receiver);
    
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('receive_message', data);
    }
    
    // Also send back to sender for their own UI update
    socket.emit('receive_message', data);
    
  });

  // Handle typing indicator
  socket.on('typing', ({ conversationId, userId, isTyping }) => {
    const recipientSocketId = onlineUsers.get(conversationId.replace(userId, '').replace('_', ''));
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('user_typing', { userId, isTyping });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove user from online users
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log('User went offline:', userId);
        io.emit('user_offline', userId);
        break;
      }
    }
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
