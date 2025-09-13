const express = require('express');
const router = express.Router();

const { signup, loginUser } = require('../controllers/authController');

router.post('/login', loginUser); // ✅ Correctly using imported function
router.post('/signup', signup);
module.exports = router;
