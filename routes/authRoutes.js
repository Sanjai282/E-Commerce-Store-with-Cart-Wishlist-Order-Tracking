const express = require('express');
const router = express.Router();
const { register, login, getMe, demoLogin, getAddresses, addAddress } = require('../controllers/authController');
const verifyToken = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/demo-login', demoLogin);
router.get('/profile', verifyToken, getMe);
router.get('/addresses', verifyToken, getAddresses);
router.post('/addresses', verifyToken, addAddress);

module.exports = router;
