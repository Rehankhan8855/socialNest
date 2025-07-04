const mongoose = require('mongoose');
const User = require('./users');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
  }],
  
 
},
{
  timestamps:true,
}
);

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;

