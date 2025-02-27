const request = require('supertest');
const express = require('express');
const Message = require('../../models/messageModel');
const messageRoutes = require('../../routes/messageRoute');

// Mock the Message model
jest.mock('../../models/messageModel');

// Create an Express app and use the message routes
const app = express();
app.use(express.json());
app.use('/messages', messageRoutes);

describe('Message Routes', () => {
    beforeEach(() => {
        // Clear mock implementations before each test
        Message.findAll.mockClear();
        Message.create.mockClear();
    });

    it('should create a new message', async () => {
        const newMessage = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            contact: '123-456-7890',
            message: 'Hello, this is a test message.',
        };

        Message.create.mockResolvedValue(newMessage);

        const response = await request(app)
            .post('/messages')
            .send(newMessage);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(newMessage);
        expect(Message.create).toHaveBeenCalledWith(newMessage);
    });

    it('should return 400 if required fields are missing', async () => {
        const invalidMessage = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            // Missing contact and message
        };

        const response = await request(app)
            .post('/messages')
            .send(invalidMessage);

        expect(response.status).toBe(400);
        expect(response.body).toEqual({ error: 'All fields are required' });
        expect(Message.create).not.toHaveBeenCalled();
    });

    it('should get all messages', async () => {
        const messages = [
            {
                name: 'John Doe',
                email: 'john.doe@example.com',
                contact: '123-456-7890',
                message: 'Hello, this is a test message.',
            },
            {
                name: 'Jane Smith',
                email: 'jane.smith@example.com',
                contact: '987-654-3210',
                message: 'Hi, another test message.',
            },
        ];

        Message.findAll.mockResolvedValue(messages);

        const response = await request(app)
            .get('/messages');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(messages);
        expect(Message.findAll).toHaveBeenCalled();
    });

    it('should handle errors when creating a message', async () => {
        Message.create.mockRejectedValue(new Error('Failed to create message'));

        const newMessage = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            contact: '123-456-7890',
            message: 'Hello, this is a test message.',
        };

        const response = await request(app)
            .post('/messages')
            .send(newMessage);

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to create message' });
        expect(Message.create).toHaveBeenCalledWith(newMessage);
    });

    it('should handle errors when fetching messages', async () => {
        Message.findAll.mockRejectedValue(new Error('Failed to fetch messages'));

        const response = await request(app)
            .get('/messages');

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Failed to fetch messages' });
        expect(Message.findAll).toHaveBeenCalled();
    });
});
