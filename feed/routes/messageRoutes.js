const express = require('express');
const router = express.Router();

const { sendMessage, getMessages, getConversationId } = require('../controllers/messageController');

// Route to send a message
router.post("/send", sendMessage);

// Route to get messages for a conversation
router.get('/get-all-messages/:conversationId', getMessages);

// Route to get conversation ID
router.post('/get-conversation-id', getConversationId);


module.exports = router;
