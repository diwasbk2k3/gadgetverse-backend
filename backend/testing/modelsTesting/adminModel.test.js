const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// Mock the Admin model
jest.mock('../../models/adminModel', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  
  const AdminMock = dbMock.define('Admin', {
    id: 1,
    username: 'adminUser',
    email: 'admin@example.com',
    password: 'securepassword',
  });

  return { Admin: AdminMock };
});

describe('Admin Model', () => {
  it('should create an admin successfully', async () => {
    const { Admin } = require('../../models/adminModel');
    const admin = await Admin.create({
      username: 'adminUser',
      email: 'admin@example.com',
      password: 'securepassword',
    });
    expect(admin.username).toBe('adminUser');
    expect(admin.email).toBe('admin@example.com');
  });

  it('should find an admin by email', async () => {
    const { Admin } = require('../../models/adminModel'); 
    const admin = await Admin.findOne({ where: { email: 'admin@example.com' } });
    expect(admin).toHaveProperty('email', 'admin@example.com');
  });
});