const express = require('express');
const router = express.Router();

const { getProfile, validateContract } = require('../middlewares');
const { getContractById } = require('../controllers/contractController');

router.get('/:id', getProfile, validateContract, getContractById);

module.exports = router;
