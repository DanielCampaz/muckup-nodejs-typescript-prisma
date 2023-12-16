import { InitializeAppForTest } from '../functions';

describe('Function: "InitializeAppForTest()"', () => {
  test('Should return instance of Express', () => {
    const app = InitializeAppForTest();
    const isExpress = 'listen' in app && 'use' in app;
    expect(isExpress).toBe(true);
  });
});
