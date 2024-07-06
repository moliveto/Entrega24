import request from 'supertest';
import app from '../app.js';

describe('Test the products router', () => {
    test('It should response the GET method', async () => {
        const response = await request(app).get('/products');
        expect(response.statusCode).toBe(200);
    });
});