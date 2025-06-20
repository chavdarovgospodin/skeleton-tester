const express = require('express');
const router = express.Router();

const { getProfile, validateDeposit } = require('../middlewares');
const { depositBalanceByUserId } = require('../controllers/balanceControllers');

router.post(
  '/deposit/:userId',
  getProfile,
  validateDeposit,
  depositBalanceByUserId
);

module.exports = router;
