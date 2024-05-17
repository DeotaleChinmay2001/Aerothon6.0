const express = require('express');
const router = express.Router();


const { login } = require('../Controller/AuthVerification/login');
const { authenticateToken } = require('../Controller/AuthVerification/validateUser');

router.post('/login', login);
router.post('/validate-token', authenticateToken);


module.exports = router;
