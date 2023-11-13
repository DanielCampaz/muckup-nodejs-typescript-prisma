import { InitializeAppForTest } from '@/utils/functions';
import request from 'supertest';

const app = InitializeAppForTest();

describe('Example Router Test /example/**', () => {
  describe('GET /example', () => {
    test('should response whit a 200 status code', async () => {
      const response = await request(app).get('/example').send();
      expect(response.statusCode).toBe(200);
    });
  });
});
