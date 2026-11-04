const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// POST /api/chat - Sanjai AI Assistant Chat Endpoint
router.post('/', chatController.sendMessage);

module.exports = router;
