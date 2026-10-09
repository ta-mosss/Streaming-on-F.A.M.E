import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { prisma, titleToJSON } from '../db.js';

function pid(req: any): string | null {
  const h = req.headers['x-profile-id'];
  return typeof h === 'string' && h.length ? h : null;
}

const ProgressBody = z.object({ titleId: z.string(), position: z.number().min(0), duration: z.number().min(0) });
const ListBody = z.object({ titleId: z.string() });

export const userDataRoutes: FastifyPluginAsync = async (app) => {
  // Progress
  app.get('/progress/:titleId', async (req, reply) => {
    const profileId = pid(req);
    if (!profileId) return reply.code(400).send({ error: 'X-Profile-Id required' });
    const { titleId } = req.params as { titleId: string };
    const row = await prisma.progress.findUnique({ where: { profileId_titleId: { profileId, titleId } } });
    if (!row) return { position: 0, duration: 0, percent: 0 };
    return { position: row.position, duration: row.duration, percent: row.duration > 0 ? row.position / row.duration : 0 };
  });

  app.post('/progress', async (req, reply) => {
    const profileId = pid(req);
    if (!profileId) return reply.code(400).send({ error: 'X-Profile-Id required' });
    const p = ProgressBody.safeParse(req.body);
    if (!p.success) return reply.code(400).send({ error: 'Invalid input' });
    const { titleId, position, duration } = p.data;
    const finished = duration > 0 && position / duration > 0.96;
    const row = await prisma.progress.upsert({
      where: { profileId_titleId: { profileId, titleId } },
      create: { profileId, titleId, position, duration, finished },
      update: { position, duration, finished }
    });
    return row;
  });

  // My List
  app.get('/mylist', async (req, reply) => {
    const profileId = pid(req);
    if (!profileId) return reply.code(400).send({ error: 'X-Profile-Id required' });
    const rows = await prisma.myList.findMany({ where: { profileId }, orderBy: { addedAt: 'desc' }, include: { title: true } });
    return rows.map(r => titleToJSON(r.title));
  });

  app.get('/mylist/ids', async (req, reply) => {
    const profileId = pid(req);
    if (!profileId) return reply.code(400).send({ error: 'X-Profile-Id required' });
    const rows = await prisma.myList.findMany({ where: { profileId }, select: { titleId: true } });
    return rows.map(r => r.titleId);
  });

  app.post('/mylist', async (req, reply) => {
    const profileId = pid(req);
    if (!profileId) return reply.code(400).send({ error: 'X-Profile-Id required' });
    const p = ListBody.safeParse(req.body);
    if (!p.success) return reply.code(400).send({ error: 'Invalid input' });
    await prisma.myList.upsert({
      where: { profileId_titleId: { profileId, titleId: p.data.titleId } },
      create: { profileId, titleId: p.data.titleId },
      update: {}
    });
    return { ok: true };
  });

  app.delete('/mylist/:titleId', async (req, reply) => {
    const profileId = pid(req);
    if (!profileId) return reply.code(400).send({ error: 'X-Profile-Id required' });
    const { titleId } = req.params as { titleId: string };
    await prisma.myList.deleteMany({ where: { profileId, titleId } });
    return { ok: true };
  });

  // Downloads (stub — always empty for now)
  app.get('/downloads', async () => []);

  // Subscriptions stub — always AD_SUPPORTED
  app.get('/subscriptions/me', async () => ({ plan: 'AD_SUPPORTED', status: 'ACTIVE' }));
};