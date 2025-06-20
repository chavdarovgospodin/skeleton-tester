const express = require('express');
const router = express.Router();

const {
  getProfile,
  validatePayJob,
  validateGetJobByContractorId,
} = require('../middlewares');
const {
  getUnpaidJobs,
  payJob,
  getJobsByContractorId,
} = require('../controllers/jobController');

router.get('/unpaid', getProfile, getUnpaidJobs);

router.get(
  '/:contractorId',
  getProfile,
  validateGetJobByContractorId,
  getJobsByContractorId
);

router.post('/:jobId/pay', getProfile, validatePayJob, payJob);

module.exports = router;
