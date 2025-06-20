const { Job, Contract, Profile, sequelize } = require('../models/model');
const { Op, Sequelize } = require('sequelize');

const depositBalanceByUserId = async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;
  const client = req.profile;

  if (parseInt(userId) !== client.id) {
    return res.status(403).json({ error: 'Unauthorized access' });
  }

  const t = await sequelize.transaction({
    isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
  });

  try {
    const unpaidJobsTotal = await Job.sum('price', {
      where: { paid: { [Op.or]: [null, false] } },
      include: [
        {
          model: Contract,
          required: true,
          where: { ClientId: client.id, status: 'in_progress' },
        },
      ],
      transaction: t,
    });

    const maxDeposit = unpaidJobsTotal ? unpaidJobsTotal * 0.25 : 0;
    if (amount > maxDeposit) {
      await t.rollback();
      return res.status(400).json({
        error: `Deposit cannot exceed 25% of unpaid jobs total (${maxDeposit.toFixed(
          2
        )})`,
      });
    }

    await Profile.update(
      { balance: Sequelize.literal(`balance + ${amount}`) },
      { where: { id: client.id }, transaction: t }
    );

    await t.commit();

    res.json({
      message: 'Deposit successful',
      newBalance: client.balance + amount,
      depositedAmount: amount,
    });
  } catch (error) {
    await t.rollback();
    console.error('Error processing deposit:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { depositBalanceByUserId };
