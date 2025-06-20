const Joi = require('joi');

const payJobSchema = Joi.object({
  params: Joi.object({
    jobId: Joi.number().integer().min(1).required(),
  }),
});

const getJobsByContractorIdSchema = Joi.object({
  params: Joi.object({
    contractorId: Joi.number().integer().min(1).required(),
  }),
});

const depositSchema = Joi.object({
  params: Joi.object({
    userId: Joi.number().integer().min(1).required(),
  }),
  body: Joi.object({
    amount: Joi.number().valid(1, 5, 10, 50, 100, 500).required().messages({
      'any.only': 'Amount must be one of: 1, 5, 10, 50, 100, 500',
      'number.min': 'Amount must be greater than 0',
    }),
  }),
});

const bestProfessionSchema = Joi.object({
  query: Joi.object({
    start: Joi.date().required(),
    end: Joi.date().required().min(Joi.ref('start')),
  }).unknown(true),
});

const bestClientsSchema = Joi.object({
  query: Joi.object({
    start: Joi.date().required(),
    end: Joi.date().required().min(Joi.ref('start')),
    limit: Joi.number().integer().min(1).optional(),
  }).unknown(true),
});

const contractSchema = Joi.object({
  params: Joi.object({
    id: Joi.number().integer().min(1).required(),
  }),
});

const validatePayJob = (req, res, next) => {
  const { error } = payJobSchema.validate({ params: req.params });
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

const validateGetJobByContractorId = (req, res, next) => {
  const { error } = getJobsByContractorIdSchema.validate({
    params: req.params,
  });
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

const validateDeposit = (req, res, next) => {
  const { error } = depositSchema.validate({
    params: req.params,
    body: req.body,
  });
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

const validateBestProfession = (req, res, next) => {
  const { error } = bestProfessionSchema.validate({ query: req.query });
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

const validateBestClients = (req, res, next) => {
  const { error } = bestClientsSchema.validate({ query: req.query });
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

const validateContract = (req, res, next) => {
  const { error } = contractSchema.validate({ params: req.params });
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

module.exports = {
  validatePayJob,
  validateDeposit,
  validateBestProfession,
  validateBestClients,
  validateContract,
  validateGetJobByContractorId,
};
