const Message = require("../model/Message");
const Conversation = require("../model/Conversation");

const sendMessage = async (req, res) => {
  // console.log("Message Received:", req.body);
  try {
    const { sender, message, receiver, conversation } = req.body;

    if (!sender || !receiver || !message || !conversation) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log("Message Received:", sender, message, receiver, conversation);
    const newMessage = await Message.create({
      sender,
      message,
      receiver,
      conversation,
    });
    
    // Yeh incorrect hai (await se populate hota nahi):
    // await newMessage.populate('sender','name _id');
    
    await newMessage.populate({
      path: "sender",
      select: "name _id",
    });
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

