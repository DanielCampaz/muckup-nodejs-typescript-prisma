import { InitializeAppForTest } from '@/utils/functions';
import request from 'supertest';

const app = InitializeAppForTest();

describe('Image Router Test /image/**', () => {
  describe('GET /image', () => {
    test('should response whit a 200 status code', async () => {
      const response = await request(app).get('/image').send();
      expect(response.statusCode).toBe(200);
    });
  });
});
