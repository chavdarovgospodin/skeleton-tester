const request = require('supertest');
const app = require('../app');
const path = require('path');
const { Profile, Job, Contract, sequelize } = require('../models/model');

describe('Balances Controller', () => {
  let profileId;

  beforeAll(async () => {
    const dbPath = path.join(__dirname, 'test_database_balances.sqlite3');
    sequelize.options.storage = dbPath;
    await sequelize.sync({ force: true });
    const contractor = await Profile.create({
      firstName: 'John',
      lastName: 'Lennon',
      profession: 'Musician',
      type: 'contractor',
      balance: 0,
    });
    const profile = await Profile.create({
      firstName: 'Test',
      lastName: 'Client',
      profession: 'Client',
      type: 'client',
      balance: 100,
    });
    profileId = profile.id;
    const contract = await Contract.create({
      terms: 'Test',
      status: 'in_progress',
      ClientId: profileId,
      ContractorId: contractor.id, // Use the created contractor
    });
    await Job.create({
      description: 'work',
      price: 200,
      ContractId: contract.id,
    });
  });

  afterAll(async () => {
    await Job.destroy({ truncate: true });
    await Contract.destroy({ truncate: true });
    await Profile.destroy({ truncate: true });
  });

  test('should deposit balance successfully', async () => {
    const response = await request(app)
      .post(`/balances/deposit/${profileId}`)
      .set('profile_id', profileId.toString())
      .send({ amount: 50 });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Deposit successful');
    expect(response.body.error).toBeUndefined();
    const updatedProfile = await Profile.findByPk(profileId);
    expect(updatedProfile.balance).toBe(150);
  });

  test('should fail with invalid amount', async () => {
    const response = await request(app)
      .post(`/balances/deposit/${profileId}`)
      .set('profile_id', profileId.toString())
      .send({ amount: -10 });
    expect(response.status).toBe(400);
    expect(response.body.error).toContain(
      'Amount must be one of: 1, 5, 10, 50, 100, 500'
    );
  });

  test('should fail with unauthorized userId', async () => {
    const otherProfile = await Profile.create({
      firstName: 'Other',
      lastName: 'User',
      profession: 'Client',
      type: 'client',
    });
    const response = await request(app)
      .post(`/balances/deposit/${otherProfile.id}`)
      .set('profile_id', profileId.toString())
      .send({ amount: 50 });
    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Unauthorized access');
  });

  test('should fail with amount exceeding 25% of unpaid jobs', async () => {
    const response = await request(app)
      .post(`/balances/deposit/${profileId}`)
      .set('profile_id', profileId.toString())
      .send({ amount: 100 });
    expect(response.status).toBe(400);
    expect(response.body.error).toContain(
      'Deposit cannot exceed 25% of unpaid jobs total'
    );
  });
});
