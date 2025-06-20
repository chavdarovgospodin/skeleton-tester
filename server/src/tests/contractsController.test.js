const request = require('supertest');
const app = require('../app');
const path = require('path');
const { Contract, Profile, sequelize } = require('../models/model');

describe('Contracts Controller', () => {
  let profileId, contractId, otherProfileId;

  beforeAll(async () => {
    const dbPath = path.join(__dirname, 'test_database_contracts.sqlite3');
    sequelize.options.storage = dbPath;
    await sequelize.sync({ force: true });
    const profile = await Profile.create({
      firstName: 'Test',
      lastName: 'Client',
      profession: 'Client',
      type: 'client',
    });
    profileId = profile.id;
    const contract = await Contract.create({
      terms: 'Test',
      status: 'in_progress',
      ClientId: profileId,
      ContractorId: 1,
    });
    contractId = contract.id;
    const otherProfile = await Profile.create({
      firstName: 'Other',
      lastName: 'User',
      profession: 'Client',
      type: 'client',
    });
    otherProfileId = otherProfile.id;
  });

  afterAll(async () => {
    await Contract.destroy({ truncate: true });
    await Profile.destroy({ truncate: true });
  });

  test('should return contract for owner', async () => {
    const response = await request(app)
      .get(`/contracts/${contractId}`)
      .set('profile_id', profileId.toString());
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(contractId);
  });

  test('should return 404 for non-owner', async () => {
    const response = await request(app)
      .get(`/contracts/${contractId}`)
      .set('profile_id', otherProfileId.toString());
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Contract not found or not accessible');
  });

  test('should fail with invalid id', async () => {
    const response = await request(app)
      .get('/contracts/0')
      .set('profile_id', profileId.toString());
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('must be greater than or equal to 1');
  });
});
