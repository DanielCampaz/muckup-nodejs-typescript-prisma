import { InitializeAppForTest } from '@/utils/functions';
import request from 'supertest';

const app = InitializeAppForTest();

describe('Video Router Test /video/**', () => {
  describe('GET /video', () => {
    test('should response whit a 200 status code', async () => {
      const response = await request(app).get('/video').send();
      expect(response.statusCode).toBe(200);
    });
  });
});
