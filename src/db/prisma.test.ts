import PrismaConnect from './prisma.class';

describe('Prisma: "Check Connection Prisma"', () => {
  test('Should error property is false', async () => {
    const prismaConnect = PrismaConnect.getInstance();
    prismaConnect.checkConnection();
    expect(prismaConnect.error).toBe(false);
  });
});
// "prisma": "npx prisma db pull --force && npx prisma generate"
