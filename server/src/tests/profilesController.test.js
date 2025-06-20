const request = require('supertest');
const app = require('../app');
const path = require('path');
const { Profile, sequelize } = require('../models/model');

describe('Profiles Controller', () => {
  beforeAll(async () => {
    const dbPath = path.join(__dirname, 'test_database_profiles.sqlite3');
    sequelize.options.storage = dbPath;
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await Profile.destroy({ truncate: true });
  });

  test('should return list of profiles', async () => {
    const response = await request(app).get('/profiles');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('should handle empty profiles', async () => {
    await Profile.destroy({ truncate: true });
    const response = await request(app).get('/profiles');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });
});
