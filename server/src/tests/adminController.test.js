const request = require('supertest');
const app = require('../app');
const path = require('path');
const { Job, Contract, Profile, sequelize } = require('../models/model');

describe('Admin Controller', () => {
  describe('Best Profession', () => {
    beforeAll(async () => {
      const dbPath = path.join(__dirname, 'test_database_admin.sqlite3');
      sequelize.options.storage = dbPath;
      await sequelize.sync({ force: true });
      const contractor = await Profile.create({
        firstName: 'Test',
        lastName: 'Contractor',
        profession: 'Dev',
        type: 'contractor',
      });
      const client = await Profile.create({
        firstName: 'Test',
        lastName: 'Client',
        profession: 'Client',
        type: 'client',
      });
      const contract = await Contract.create({
        terms: 'Test',
        status: 'in_progress',
        ClientId: client.id,
        ContractorId: contractor.id,
      });
      await Job.create({
        description: 'work',
        price: 200,
        paid: true,
        paymentDate: new Date('2025-06-07'),
        ContractId: contract.id,
      });
    });

    afterAll(async () => {
      await Job.destroy({ truncate: true });
      await Contract.destroy({ truncate: true });
      await Profile.destroy({ truncate: true });
    });

    test('should return best profession', async () => {
      const response = await request(app).get(
        '/admin/best-profession?start=2025-06-01&end=2025-06-08'
      );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('profession', 'Dev');
      expect(response.body).toHaveProperty('totalEarned', 200);
    });

    test('should fail with invalid date range', async () => {
      const response = await request(app).get(
        '/admin/best-profession?start=2025-06-08&end=2025-06-01'
      );
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('must be greater than or equal');
    });
  });

  describe('Best Clients', () => {
    beforeAll(async () => {
      await sequelize.sync({ force: true });
      const client1 = await Profile.create({
        firstName: 'Alice',
        lastName: 'Smith',
        type: 'client',
        profession: 'contractor',
      });
      const client2 = await Profile.create({
        firstName: 'Bob',
        lastName: 'Jones',
        type: 'client',
        profession: 'client',
      });
      const contractor = await Profile.create({
        firstName: 'Test',
        lastName: 'Contractor',
        type: 'contractor',
        profession: 'contractor',
      });
      const contract1 = await Contract.create({
        terms: 'Test',
        status: 'in_progress',
        ClientId: client1.id,
        ContractorId: contractor.id,
      });
      const contract2 = await Contract.create({
        terms: 'Test',
        status: 'in_progress',
        ClientId: client2.id,
        ContractorId: contractor.id,
      });
      await Job.create({
        description: 'work',
        price: 150,
        paid: true,
        paymentDate: new Date('2025-06-07'),
        ContractId: contract1.id,
      });
      await Job.create({
        description: 'work',
        price: 100,
        paid: true,
        paymentDate: new Date('2025-06-07'),
        ContractId: contract2.id,
      });
    });

    afterAll(async () => {
      await Job.destroy({ truncate: true });
      await Contract.destroy({ truncate: true });
      await Profile.destroy({ truncate: true });
    });

    test('should return top clients', async () => {
      const response = await request(app).get(
        '/admin/best-clients?start=2025-06-01&end=2025-06-08'
      );
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
    });

    test('should work with custom limit of 1', async () => {
      const response = await request(app).get(
        '/admin/best-clients?start=2025-06-01&end=2025-06-08&limit=1'
      );
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
    });

    test('should fail with invalid date range', async () => {
      const response = await request(app).get(
        '/admin/best-clients?start=2025-06-08&end=2025-06-01'
      );
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('must be greater than or equal');
    });

    test('should fail with invalid limit', async () => {
      const response = await request(app).get(
        '/admin/best-clients?start=2025-06-01&end=2025-06-08&limit=0'
      );
      expect(response.status).toBe(400);
      expect(response.body.error).toContain('limit');
    });
  });
});
