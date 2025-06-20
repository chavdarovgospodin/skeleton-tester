const { Contract } = require('../models/model');
const { Op } = require('sequelize');

const getContractById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.profile.id;

    const contract = await Contract.findOne({
      where: { id, [Op.or]: [{ ClientId: userId }, { ContractorId: userId }] },
    });

    if (!contract)
      return res
        .status(404)
        .json({ error: 'Contract not found or not accessible' });

    res.json(contract);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getContractById };
