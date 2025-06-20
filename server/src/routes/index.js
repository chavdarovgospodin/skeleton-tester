const express = require('express');
const router = express.Router();

const jobRoutes = require('./jobRoutes');
const contractRoutes = require('./contractRoutes');
const profileRoutes = require('./profileRoutes');
const balanceRoutes = require('./balanceRoutes');
const adminRoutes = require('./adminRoutes');

router.use('/jobs', jobRoutes);
router.use('/contracts', contractRoutes);
router.use('/profiles', profileRoutes);
router.use('/balances', balanceRoutes);
router.use('/admin', adminRoutes);

module.exports = router;
