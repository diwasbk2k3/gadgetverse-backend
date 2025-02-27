const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

// Mock the Message model
jest.mock('../../models/messageModel', () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();

  const MessageMock = dbMock.define('Message', {
    name: 'John Doe',
    email: 'john.doe@example.com',
    contact: '123-456-7890',
    message: 'This is a test message.',
  });

  return { Message: MessageMock };
});

describe('Message Model', () => {
  it('should create a message successfully', async () => {
    const { Message } = require('../../models/messageModel');
    const message = await Message.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      contact: '123-456-7890',
      message: 'This is a test message.',
    });
    expect(message.name).toBe('John Doe');
    expect(message.email).toBe('john.doe@example.com');
    expect(message.contact).toBe('123-456-7890');
    expect(message.message).toBe('This is a test message.');
  });

  it('should find a message by email', async () => {
    const { Message } = require('../../models/messageModel');
    const message = await Message.findOne({ where: { email: 'john.doe@example.com' } });
    expect(message).toHaveProperty('email', 'john.doe@example.com');
    expect(message).toHaveProperty('name', 'John Doe');
  });
});