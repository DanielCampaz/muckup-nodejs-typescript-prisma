import { InitializeAppForTest } from '@/utils/functions';
import request from 'supertest';

const app = InitializeAppForTest();

describe('Document Router Test /document/**', () => {
  describe('GET /document', () => {
    test('should response whit a 200 status code', async () => {
      const response = await request(app).get('/document').send();
      expect(response.statusCode).toBe(200);
    });
  });
});
