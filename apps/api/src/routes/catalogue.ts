import type { FastifyPluginAsync } from 'fastify';
import { prisma, titleToJSON } from '../db.js';

function profileId(req: any): string | null {
  const h = req.headers['x-profile-id'];
  return typeof h === 'string' && h.length ? h : null;
}

export const catalogueRoutes: FastifyPluginAsync = async (app) => {
  app.get('/', async (req) => {
    const q = req.query as Record<string, string>;
    const where: any = {};
    if (q.type) where.type = q.type.toUpperCase();
    if (q.year) where.year = parseInt(q.year, 10);
    if (q.original === '1') where.isOriginal = true;
    if (q.kids === '1') where.isKids = true;
    if (q.featured === '1') where.isFeatured = true;
    const items = await prisma.title.findMany({ where, orderBy: [{ trend: 'asc' }], take: 50 });
    return items.map(titleToJSON);
  });

  app.get('/top10', async () => {
    const items = await prisma.title.findMany({ orderBy: { trend: 'asc' }, take: 10 });
    return items.map(titleToJSON);
  });

  app.get('/continue-watching', async (req) => {
    const pid = profileId(req);
    if (!pid) return [];
    const rows = await prisma.progress.findMany({
      where: { profileId: pid, finished: false, position: { gt: 0 }, duration: { gt: 0 } },
      orderBy: { updatedAt: 'desc' },
      take: 10,
      include: { title: true }
    });
    return rows.map(r => ({ ...titleToJSON(r.title), progress: r.duration > 0 ? r.position / r.duration : 0 }));
  });

  app.get('/search', async (req) => {
    const q = req.query as Record<string, string>;
    const where: any = {};
    if (q.type && q.type !== 'all') where.type = q.type.toUpperCase();
    if (q.q) where.OR = [{ name: { contains: q.q } }, { genre: { contains: q.q } }, { synopsis: { contains: q.q } }];
    const items = await prisma.title.findMany({ where, orderBy: { trend: 'asc' }, take: 40 });
    return items.map(titleToJSON);
  });

  app.get('/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const t = await prisma.title.findFirst({ where: { OR: [{ id }, { slug: id }] } });
    if (!t) return reply.code(404).send({ error: 'Not found' });
    return titleToJSON(t);
  });

  app.get('/:id/similar', async (req, reply) => {
    const { id } = req.params as { id: string };
    const t = await prisma.title.findFirst({ where: { OR: [{ id }, { slug: id }] } });
    if (!t) return reply.code(404).send({ error: 'Not found' });
    const items = await prisma.title.findMany({
      where: { id: { not: t.id }, OR: [{ genre: t.genre }, { type: t.type }] },
      take: 8
    });
    return items.map(titleToJSON);
  });
};