const Message = require("../model/Message");
const Conversation = require("../model/Conversation");

const sendMessage = async (req, res) => {
  console.log("Message Received:", req.body);
  try {
    const { sender, message, receiver, conversation } = req.body;
    const newMessage = await Message.create({ sender, message, receiver, conversation });
    
    await newMessage.populate('sender','name _id',);
    // await newMessage.save();
    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    
    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID is required' });
    }
    
    const messages = await Message.find({ conversation: conversationId })
      .populate('sender','name _id',)
      .sort({ createdAt: 1 });
    
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
};

const getConversationId = async (req, res) => {
  try {
    const { currentUserId, receiverId } = req.body;
    
    // Find or create conversation
    let conversation = await Conversation.findOne({
      members: { $all: [currentUserId, receiverId] },
    });
    
    if (!conversation) {
      // Create new conversation if it doesn't exist
      conversation = await Conversation.create({
        members: [currentUserId, receiverId],
      });
    }
    
    res.status(200).json({ 
      conversationId: conversation._id,
      members: conversation.members
    });
  } catch (error) {
    console.error('Error in getConversationId:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getConversationId
};



// import { getReceiverSocketId, io } from "../SocketIO/server.js";
// const Message = require("../model/Message");
// const Conversation = require("../model/Conversation");
// const sendMessage = async (req, res) => {
//   try {
//     const { message } = req.body;
//     const { id: receiverId } = req.params;
//     const senderId = req.user._id; // current logged in user
//     let conversation = await Conversation.findOne({
//       members: { $all: [senderId, receiverId] },
//     });
//     if (!conversation) {
//       conversation = await Conversation.create({
//         members: [senderId, receiverId],
//       });
//     }
//     const newMessage = new Message({
//       senderId,
//       receiverId,
//       message,
//     });
//     if (newMessage) {
//       conversation.messages.push(newMessage._id);
//     }
//     // await conversation.save()
//     // await newMessage.save();
//     await Promise.all([conversation.save(), newMessage.save()]); // run parallel
//     const receiverSocketId = getReceiverSocketId(receiverId);
//     if (receiverSocketId) {
//       io.to(receiverSocketId).emit("newMessage", newMessage);
//     }
//     res.status(201).json(newMessage);
//   } catch (error) {
//     console.log("Error in sendMessage", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// export const getMessage = async (req, res) => {
//   try {
//     const { id: chatUser } = req.params;
//     const senderId = req.user._id; // current logged in user
//     let conversation = await Conversation.findOne({
//       members: { $all: [senderId, chatUser] },
//     }).populate("messages");
//     if (!conversation) {
//       return res.status(201).json([]);
//     }
//     const messages = conversation.messages;
//     res.status(201).json(messages);
//   } catch (error) {
//     console.log("Error in getMessage", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };