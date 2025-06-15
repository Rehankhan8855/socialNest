const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
// const {sendMessage} = require("../controllers/messageController");



router.get('/', (req, res) => {
    res.send('hello world')
})

// router.post("/send", sendMessage);



router.post('/login',authController.login);
router.post('/signup',authController.signup);


module.exports = router;




