import request from 'supertest';
import app from '../app.js';

describe('Test the users router', () => {
    test('It should response the GET method', async () => {
        const response = await request(app).get('/users');
        expect(response.statusCode).toBe(200);
    });
});