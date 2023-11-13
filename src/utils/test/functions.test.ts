import { PrismaClient } from '@prisma/client';
import { InitializeAppForTest, PrismaClientInstance } from '../functions';

describe('Function: "InitializeAppForTest()"', () => {
  test('Should return instance of Express', () => {
    const app = InitializeAppForTest();
    const isExpress = 'listen' in app && 'use' in app;
    expect(isExpress).toBe(true);
  });
});

describe('Function: "PrismaClientInstance()"', () => {
  test('Should return instance of PrismaClient', () => {
    const prisma = PrismaClientInstance();
    expect(prisma).toBeInstanceOf(PrismaClient);
  });
});
