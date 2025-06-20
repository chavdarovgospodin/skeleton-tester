const { Contract, Job, Profile } = require('../models/model');
const { Op, Sequelize } = require('sequelize');
const { sequelize } = require('../models/model');

const getUnpaidJobs = async (req, res) => {
  try {
    const jobs = await Job.findAll({
      where: {
        [Op.or]: [{ paid: null }, { paid: false }],
      },
      include: [
        {
          model: Contract,
          required: true,
          where: {
            status: 'in_progress',
            [Op.or]: [
              { ClientId: req.profile.id },
              { ContractorId: req.profile.id },
            ],
          },
        },
      ],
    });

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getJobsByContractorId = async (req, res) => {
  const { contractorId } = req.params;

  try {
    const whereClause = {
      ClientId: req.profile.id,
      ContractorId: contractorId,
      status: 'in_progress',
    };

    const jobs = await Job.findAll({
      include: [
        {
          model: Contract,
          where: whereClause,
          required: true,
        },
      ],
      order: [['id', 'ASC']],
    });

    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const payJob = async (req, res) => {
  const { jobId } = req.params;
  const client = req.profile;

  const t = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  });

  try {
    const job = await Job.findOne({
      where: { id: jobId },
      include: [
        {
          model: Contract,
          required: true,
          where: { ClientId: client.id, status: 'in_progress' },
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    console.log(client.id);
    console.log(jobId);

    if (!job) {
      await t.rollback();
      return res.status(404).json({ error: 'Job not found or not accessible' });
    }
    if (job.paid) {
      await t.rollback();
      return res.status(400).json({ error: 'Job is already paid' });
    }
    const amount = job.price;
    if (client.balance < amount) {
      await t.rollback();
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const contractor = await Profile.findOne({
      where: { id: job.Contract.ContractorId },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!contractor) {
      throw new Error('Contractor not found');
    }

    await Profile.update(
      { balance: sequelize.literal(`balance - ${amount}`) },
      { where: { id: client.id }, transaction: t }
    );
    await Profile.update(
      { balance: sequelize.literal(`balance + ${amount}`) },
      { where: { id: contractor.id }, transaction: t }
    );

    await job.update(
      { paid: true, paymentDate: new Date() },
      { transaction: t }
    );

    await t.commit();

    res.json({ message: 'Payment successful', jobId: job.id });
  } catch (error) {
    await t.rollback();
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getUnpaidJobs, payJob, getJobsByContractorId };
