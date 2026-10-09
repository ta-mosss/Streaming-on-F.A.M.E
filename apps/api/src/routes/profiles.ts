import type { FastifyPluginAsync } from 'fastify';
import { prisma } from '../db.js';

export const profileRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async () => {
    const profiles = await prisma.profile.findMany({
      take: 5,
      orderBy: { createdAt: 'asc' },
      select: { id: true, name: true, isKids: true, avatar: true, accentA: true, accentB: true }
    });
    return profiles;
  });
};