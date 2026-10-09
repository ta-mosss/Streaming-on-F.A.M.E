import Fastify from 'fastify';
import cors from '@fastify/cors';
import authPlugin from './plugins/auth.js';
import { authRoutes } from './routes/auth.js';
import { profileRoutes } from './routes/profiles.js';
import { catalogueRoutes } from './routes/catalogue.js';
import { userDataRoutes } from './routes/userdata.js';

const app = Fastify({ logger: true });

async function main() {
  await app.register(cors, {
    origin: [process.env.WEB_ORIGIN || 'http://localhost:3000', 'http://localhost:3000'],
    credentials: true
  });
  await app.register(authPlugin);

  app.get('/', async () => ({ ok: true, service: 'fame-api', version: '0.1.0' }));

  await app.register(authRoutes,       { prefix: '/v1/auth' });
  await app.register(profileRoutes,    { prefix: '/v1/profiles' });
  await app.register(catalogueRoutes,  { prefix: '/v1/catalogue' });
  await app.register(userDataRoutes,   { prefix: '/v1' });

  app.setErrorHandler((err, _req, reply) => {
    app.log.error(err);
    reply.code(err.statusCode || 500).send({ error: err.name, message: err.message });
  });

  const port = Number(process.env.PORT || 4000);
  await app.listen({ port, host: '0.0.0.0' });
  console.log('\n🚀 F.A.M.E API ready at http://localhost:' + port + '\n');
}

main().catch(e => { console.error(e); process.exit(1); });