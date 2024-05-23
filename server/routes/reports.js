const express = require('express');
const router = express.Router();
const getAllReports = require('../Controller/Reports/getAllReports')
const getUserReports = require('../Controller/Reports/getUserReports')


router.get('/allreports', getAllReports);
router.get('/user/:userName', getUserReports);


module.exports = router;
