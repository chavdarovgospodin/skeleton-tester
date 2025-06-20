const { Profile } = require('../models/model');

const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.findAll();

    res.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAllProfiles };
