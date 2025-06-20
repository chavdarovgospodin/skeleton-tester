const { getProfile } = require('./getProfile');
const {
  validatePayJob,
  validateDeposit,
  validateBestProfession,
  validateBestClients,
  validateContract,
  validateGetJobByContractorId,
} = require('./validation');

module.exports = {
  getProfile,
  validatePayJob,
  validateDeposit,
  validateBestProfession,
  validateBestClients,
  validateContract,
  validateGetJobByContractorId,
};
