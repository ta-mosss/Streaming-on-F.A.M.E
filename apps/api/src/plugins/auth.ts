import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    signAccessToken: (p: { sub: string; email: string }) => string;
  }
}

const plugin: FastifyPluginAsync = async (app) => {
  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'dev-secret-change-me',
    sign: { expiresIn: '30d' }
  });

  app.decorate('signAccessToken', (p) => app.jwt.sign(p));

  app.decorate('authenticate', async (req, reply) => {
    try { await req.jwtVerify(); }
    catch { return reply.code(401).send({ error: 'Unauthorized' }); }
  });
};

export default fp(plugin, { name: 'auth' });