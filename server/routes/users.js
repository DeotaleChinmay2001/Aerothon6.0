const express = require('express');
const router = express.Router();
const decryptMiddleware = require('../middleware/decrytMiddleware')
const { login } = require('../Controller/AuthVerification/login');
const { authenticateToken } = require('../Controller/AuthVerification/validateUser');

router.post('/login', decryptMiddleware,login);
router.post('/validate-token', authenticateToken);


module.exports = router;
