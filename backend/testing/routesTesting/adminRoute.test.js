const request = require('supertest');
const express = require('express');
const Admin = require('../../models/adminModel'); 
const router = require('../../routes/adminRoute'); 
const jwtUtil = require('../../utils/jwtUtil'); 
const db = require('../../database/db');

// Mock Sequelize methods and Admin model
jest.mock('../../models/adminModel');

describe('Admin Routes', () => {
  const app = express();
  app.use(express.json());
  app.use('/admin', router);

  // Mock Admin model methods
  const mockAdminData = {
    id: 1,
    username: 'adminUser',
    email: 'admin@example.com',
    password: 'securepassword',
  };

  // Test case for getting all admins
  it('should return a list of admins', async () => {
    // Mocking the Sequelize findAll method
    Admin.findAll.mockResolvedValue([mockAdminData]);

    const response = await request(app).get('/admin');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([mockAdminData]);
  });

  // Test case for Admin login (POST request)
  it('should login the admin successfully', async () => {
    // Mocking the Sequelize findOne method
    Admin.findOne.mockResolvedValue(mockAdminData);
    // Mocking the generateToken method from jwtUtil
    jwtUtil.generateToken = jest.fn().mockReturnValue('fakeToken');

    const loginData = {
      email: 'admin@example.com',
      password: 'securepassword',
    };

    const response = await request(app)
      .post('/admin/login')
      .send(loginData);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Admin login successful');
    expect(response.body.token).toBe('fakeToken');
    expect(response.body.email).toBe('admin@example.com');
  });

  // Test case for login with invalid credentials
  it('should return 401 for invalid login', async () => {
    // Mocking the Sequelize findOne method for invalid login
    Admin.findOne.mockResolvedValue(null); // No admin found

    const loginData = {
      email: 'invalid@example.com',
      password: 'wrongpassword',
    };

    const response = await request(app)
      .post('/admin/login')
      .send(loginData);

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid email or password');
  });

  // Additional test case for error handling
  it('should handle errors when fetching admins', async () => {
    // Mocking the findAll method to throw an error
    Admin.findAll.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/admin');
    expect(response.status).toBe(500);
    expect(response.body.error).toBe('Failed to fetch admins');
  });

  afterAll(async () => {
    console.log('All tests completed. Closing database connection...');
    await db.close(); 
    jest.useRealTimers(); 
  });
});
