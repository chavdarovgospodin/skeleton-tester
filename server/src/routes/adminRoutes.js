const express = require('express');
const router = express.Router();

const {
  validateBestProfession,
  validateBestClients,
} = require('../middlewares');
const {
  getBestProfession,
  getBestClients,
} = require('../controllers/adminController');

router.get('/best-profession', validateBestProfession, getBestProfession);
router.get('/best-clients', validateBestClients, getBestClients);

module.exports = router;
