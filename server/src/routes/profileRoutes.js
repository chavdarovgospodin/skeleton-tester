const express = require('express');
const router = express.Router();

const { getAllProfiles } = require('../controllers/profileController');

router.get('/', getAllProfiles);

module.exports = router;
