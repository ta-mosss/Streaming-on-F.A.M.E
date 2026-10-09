import { PrismaClient } from '@prisma/client';

const g = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = g.prisma ?? new PrismaClient({ log: ['warn', 'error'] });
if (process.env.NODE_ENV !== 'production') g.prisma = prisma;

export function titleToJSON(t: any): any {
  if (!t) return t;
  return { ...t, cast: typeof t.cast === 'string' ? JSON.parse(t.cast) : (t.cast ?? []) };
}