import App from '@/app';
import { Main } from '@/main';
import { PrismaClient } from '@prisma/client';
import { type Express } from 'express';

let instancePrisma: PrismaClient | null = null;

export function InitializeAppForTest(): Express {
  Main(false);
  return App.getInstance().app;
}

export function PrismaClientInstance(): PrismaClient {
  if (instancePrisma === null) {
    instancePrisma = new PrismaClient();
  }

  return instancePrisma;
}
