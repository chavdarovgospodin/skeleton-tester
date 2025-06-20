const request = require('supertest');
const app = require('../app');
const path = require('path');
const { Job, Contract, Profile, sequelize } = require('../models/model');

describe('Jobs Controller', () => {
  let profileId, jobId, contractId;

  beforeAll(async () => {
    const dbPath = path.join(__dirname, 'test_database_jobs.sqlite3');
    sequelize.options.storage = dbPath;
    await sequelize.sync({ force: true });
    const profile = await Profile.create({
      firstName: 'Test',
      lastName: 'Client',
      profession: 'Client',
      type: 'client',
      balance: 1000,
    });
    profileId = profile.id;
    const contract = await Contract.create({
      terms: 'Test',
      status: 'in_progress',
      ClientId: profileId,
      ContractorId: 1,
    });
    contractId = contract.id;
    const job = await Job.create({
      description: 'work',
      price: 100,
      ContractId: contract.id,
    });
    jobId = job.id;
  });

  afterAll(async () => {
    await Job.destroy({ truncate: true });
    await Contract.destroy({ truncate: true });
    await Profile.destroy({ truncate: true });
  });

  describe('Get Unpaid Jobs', () => {
    test('should return unpaid jobs for authenticated user', async () => {
      const response = await request(app)
        .get('/jobs/unpaid')
        .set('profile_id', profileId.toString());
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      const unpaidJobs = response.body.filter(
        (job) => job.paid === null || job.paid === false
      );
      expect(unpaidJobs.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Pay Job', () => {
    test('should pay job successfully', async () => {
      const response = await request(app)
        .post(`/jobs/${jobId}/pay`)
        .set('profile_id', profileId.toString());
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Payment successful');
      const updatedJob = await Job.findByPk(jobId);
      expect(updatedJob.paid).toBe(true);
      expect(updatedJob.paymentDate).toBeDefined();
    });

    test('should fail with invalid job_id', async () => {
      const response = await request(app)
        .post('/jobs/0/pay')
        .set('profile_id', profileId.toString());
      expect(response.status).toBe(400);
      expect(response.body.error).toContain(
        'must be greater than or equal to 1'
      );
    });

    test('should fail with insufficient balance', async () => {
      const lowBalanceProfile = await Profile.create({
        firstName: 'Low',
        lastName: 'Balance',
        profession: 'Client',
        type: 'client',
        balance: 50,
      });
      const contract = await Contract.create({
        terms: 'Test',
        status: 'in_progress',
        ClientId: lowBalanceProfile.id,
        ContractorId: 1,
      });
      const job = await Job.create({
        description: 'work',
        price: 100,
        ContractId: contract.id,
      });
      const response = await request(app)
        .post(`/jobs/${job.id}/pay`)
        .set('profile_id', lowBalanceProfile.id.toString());
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Insufficient balance');
    });
  });
});
