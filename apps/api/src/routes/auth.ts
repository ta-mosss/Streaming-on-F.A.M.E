import type { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../db.js';

const Reg = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6) });
const Log = z.object({ email: z.string().email(), password: z.string().min(1) });

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post('/register', async (req, reply) => {
    const p = Reg.safeParse(req.body);
    if (!p.success) return reply.code(400).send({ error: 'Invalid input' });
    const { name, email, password } = p.data;

    if (await prisma.user.findUnique({ where: { email: email.toLowerCase() } }))
      return reply.code(409).send({ error: 'Email already registered' });

    const user = await prisma.user.create({
      data: { email: email.toLowerCase(), name, passwordHash: await bcrypt.hash(password, 10) }
    });

    await prisma.profile.createMany({ data: [
      { userId: user.id, name: name.split(' ')[0] || 'You', isKids: false, avatar: (name[0] || 'U').toUpperCase(), accentA: '#E5007E', accentB: '#4A0E7A' },
      { userId: user.id, name: 'Family', isKids: false, avatar: 'F', accentA: '#11998E', accentB: '#38EF7D' },
      { userId: user.id, name: 'Kids',   isKids: true,  avatar: 'K', accentA: '#00B4DB', accentB: '#0083B0' }
    ]});

    const accessToken = app.signAccessToken({ sub: user.id, email: user.email });
    return reply.code(201).send({ user: { id: user.id, email: user.email, name: user.name }, accessToken });
  });

  app.post('/login', async (req, reply) => {
    const p = Log.safeParse(req.body);
    if (!p.success) return reply.code(400).send({ error: 'Invalid input' });
    const { email, password } = p.data;

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return reply.code(401).send({ error: 'Invalid email or password' });

    if (!(await bcrypt.compare(password, user.passwordHash)))
      return reply.code(401).send({ error: 'Invalid email or password' });

    const accessToken = app.signAccessToken({ sub: user.id, email: user.email });
    return { user: { id: user.id, email: user.email, name: user.name }, accessToken };
  });
};