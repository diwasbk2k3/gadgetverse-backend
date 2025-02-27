const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// Mock the User model
jest.mock('../../models/userModel', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const UserMock = dbMock.define('User', {
    customer_id: '12345',
    email: 'user@example.com',
    password: 'userpassword',
  });

  return { User: UserMock };
});

describe('User Model', () => {
  it('should create a user successfully', async () => {
    const { User } = require('../../models/userModel'); 
    const user = await User.create({
      customer_id: '12345',
      email: 'user@example.com',
      password: 'userpassword',
    });
    expect(user.customer_id).toBe('12345');
    expect(user.email).toBe('user@example.com');
  });

  it('should find a user by email', async () => {
    const { User } = require('../../models/userModel'); 
    const user = await User.findOne({ where: { email: 'user@example.com' } });
    expect(user).toHaveProperty('email', 'user@example.com');
  });
});