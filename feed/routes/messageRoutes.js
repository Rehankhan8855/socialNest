const express = require('express');
const router = express.Router();

const { sendMessage, getMessages } = require('../controllers/messageController');

// Route to send a message
router.post('/send', sendMessage);

// Route to get messages for a conversation
router.get('/:conversationId', getMessages);

module.exports = router;
