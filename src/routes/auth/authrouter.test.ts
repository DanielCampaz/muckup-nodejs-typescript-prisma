import { InitializeAppForTest } from '@/utils/functions';
import request from 'supertest';

const app = InitializeAppForTest();

describe('Audio Router Test /audio/**', () => {
  describe('GET /audio', () => {
    test('should response whit a 200 status code', async () => {
      const response = await request(app).get('/audio').send();
      expect(response.statusCode).toBe(200);
    });
  });
});
