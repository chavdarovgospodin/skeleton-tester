const { Job, Contract, Profile } = require('../models/model');
const { Op, Sequelize } = require('sequelize');

const getBestProfession = async (req, res) => {
  const { start, end } = req.query;

  try {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const bestProfession = await Job.findAll({
      attributes: [
        [Sequelize.col('Contract.Contractor.profession'), 'profession'],
        [Sequelize.fn('SUM', Sequelize.col('price')), 'totalEarned'],
      ],
      include: [
        {
          model: Contract,
          required: true,
          include: [
            {
              model: Profile,
              as: 'Contractor',
              required: true,
              attributes: [],
            },
          ],
        },
      ],
      where: {
        paid: true,
        paymentDate: { [Op.between]: [startDate, endDate] },
      },
      group: ['Contract.Contractor.profession'],
      order: [[Sequelize.fn('SUM', Sequelize.col('price')), 'DESC']],
      limit: 1,
    });

    if (bestProfession.length === 0) return res.json([]);

    const result = {
      profession: bestProfession[0].get('profession'),
      totalEarned: parseFloat(bestProfession[0].get('totalEarned')),
    };

    res.json(result);
  } catch (error) {
    console.error('Error fetching best profession:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getBestClients = async (req, res) => {
  const { start, end, limit } = req.query;

  try {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const parsedLimit = parseInt(limit) || 2;

    const bestClients = await Job.findAll({
      attributes: [
        [Sequelize.col('Contract.Client.id'), 'id'],
        [
          Sequelize.fn(
            'CONCAT',
            Sequelize.col('Contract.Client.firstName'),
            ' ',
            Sequelize.col('Contract.Client.lastName')
          ),
          'fullName',
        ],
        [Sequelize.fn('SUM', Sequelize.col('price')), 'paid'],
      ],
      include: [
        {
          model: Contract,
          required: true,
          include: [
            {
              model: Profile,
              as: 'Client',
              required: true,
              attributes: [],
            },
          ],
        },
      ],
      where: {
        paid: true,
        paymentDate: { [Op.between]: [startDate, endDate] },
      },
      group: [
        'Contract.Client.id',
        'Contract.Client.firstName',
        'Contract.Client.lastName',
      ],
      order: [[Sequelize.fn('SUM', Sequelize.col('price')), 'DESC']],
      limit: parsedLimit,
    });

    if (bestClients.length === 0) return res.json([]);

    const result = bestClients.map((client) => ({
      id: client.get('id'),
      fullName: client.get('fullName'),
      paid: parseFloat(client.get('paid')),
    }));

    res.json(result);
  } catch (error) {
    console.error('Error fetching best clients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getBestProfession, getBestClients };
