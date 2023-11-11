import app from '@/main';
import request from 'supertest';

describe('GET /ping', () => {
  test('should response whit a 200 status code', async () => {
    const response = await request(app).get('/ping').send();
    expect(response.statusCode).toBe(200);
  });
});

describe('One', () => {
  test('should response whit 2+4 = 6', () => {
    expect(2 + 4).toBe(6);
  });
});
