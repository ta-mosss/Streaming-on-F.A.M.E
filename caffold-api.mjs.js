// scaffold-api.mjs — F.A.M.E apps/api/ scaffold
// Usage:  node scaffold-api.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = 'apps/api';
const F = {};

// ═══════════════════════════════════════════════════════════════════
//  CONFIG
// ═══════════════════════════════════════════════════════════════════

F['package.json'] = JSON.stringify({
  name: '@fame/api',
  version: '0.1.0',
  private: true,
  type: 'module',
  scripts: {
    dev: 'tsx watch src/server.ts',
    build: 'tsc --noEmit',
    start: 'node --loader tsx src/server.ts',
    'db:push': 'prisma db push',
    'db:studio': 'prisma studio',
    seed: 'tsx prisma/seed.ts',
    typecheck: 'tsc --noEmit'
  },
  dependencies: {
    '@fastify/cors': '^10.0.1',
    '@fastify/jwt': '^9.0.1',
    '@fastify/rate-limit': '^10.1.1',
    '@prisma/client': '^6.1.0',
    bcryptjs: '^2.4.3',
    'fastify': '^5.2.0',
    'fastify-plugin': '^5.0.1',
    'zod': '^3.24.1'
  },
  devDependencies: {
    '@types/bcryptjs': '^2.4.6',
    '@types/node': '^22.10.2',
    'prisma': '^6.1.0',
    'tsx': '^4.19.2',
    'typescript': '^5.7.2'
  }
}, null, 2);

F['tsconfig.json'] = `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "noEmit": true,
    "allowSyntheticDefaultImports": true,
    "types": ["node"]
  },
  "include": ["src/**/*", "prisma/**/*"]
}`;

F['.env.example'] = `# ── Database ──────────────────────────────────────────────────────
# Dev (SQLite — zero setup):
DATABASE_URL="file:./dev.db"

# Prod (PostgreSQL — uncomment and edit for production):
# DATABASE_URL="postgresql://fame:fame@localhost:5432/fame"

# ── Auth ──────────────────────────────────────────────────────────
JWT_SECRET="dev-secret-change-me-in-production-use-a-32-byte-string"

# ── Server ────────────────────────────────────────────────────────
PORT=4000
NODE_ENV=development

# ── CORS ──────────────────────────────────────────────────────────
WEB_ORIGIN=http://localhost:3000

# ── PayFast (optional — leave blank for demo) ─────────────────────
PAYFAST_MERCHANT_ID=
PAYFAST_MERCHANT_KEY=
PAYFAST_PASSPHRASE=
PAYFAST_SANDBOX=true

# ── Cloudflare Stream (optional — leave blank for demo) ───────────
CF_ACCOUNT_ID=
CF_STREAM_TOKEN=`;

F['.env'] = `DATABASE_URL="file:./dev.db"
JWT_SECRET="dev-secret-change-me-in-production-use-a-32-byte-string"
PORT=4000
NODE_ENV=development
WEB_ORIGIN=http://localhost:3000
PAYFAST_MERCHANT_ID=
PAYFAST_MERCHANT_KEY=
PAYFAST_PASSPHRASE=
PAYFAST_SANDBOX=true
CF_ACCOUNT_ID=
CF_STREAM_TOKEN=`;

F['.gitignore'] = `node_modules
dist
.env
.env.local
*.db
*.db-journal
.DS_Store`;

F['README.md'] = `# @fame/api — Streaming on F.A.M.E API

Fastify 5 + Prisma 6 + JWT REST API for the F.A.M.E VOD platform.

## Setup

\\\`\\\`\\\`bash
npm install
npx prisma db push
npm run seed     # 12 titles + demo user
npm run dev
\\\`\\\`\\\`

Server runs at http://localhost:4000.

## Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | /v1/auth/register | — | Create account |
| POST | /v1/auth/login | — | Sign in → JWT |
| POST | /v1/auth/refresh | — | Refresh access token |
| GET | /v1/profiles | Header | Profiles for the session |
| GET | /v1/catalogue | — | Full catalogue (filterable) |
| GET | /v1/catalogue/top10 | — | Top 10 |
| GET | /v1/catalogue/continue-watching | X-Profile-Id | Resume watching |
| GET | /v1/catalogue/search | — | Search |
| GET | /v1/catalogue/:id | — | Title detail |
| GET | /v1/catalogue/:id/similar | — | Recommendations |
| GET | /v1/progress/:titleId | X-Profile-Id | Watch position |
| POST | /v1/progress | X-Profile-Id | Update position |
| GET | /v1/mylist | X-Profile-Id | Saved titles |
| GET | /v1/mylist/ids | X-Profile-Id | Saved title IDs |
| POST | /v1/mylist | X-Profile-Id | Add to list |
| DELETE | /v1/mylist/:titleId | X-Profile-Id | Remove from list |
| GET | /v1/downloads | X-Profile-Id | Downloaded titles |
| GET | /v1/subscriptions/me | X-Profile-Id | Current plan |
| POST | /v1/subscriptions/start | X-Profile-Id | Begin PayFast flow |
| POST | /v1/subscriptions/itn | — | PayFast webhook |
| GET | /v1/stream/token/:titleId | — | Playback URL + token |

## Auth

- **Accounts:** JWT via \`Authorization: Bearer <token>\`
- **Profiles (demo):** \`X-Profile-Id: <id>\` header — lets the UI work without full token wiring
- **Demo user seeded:** \`demo@fame.local\` / \`demo1234\`

## Switch to PostgreSQL

1. Edit \`.env\`: set \`DATABASE_URL\` to a Postgres connection string
2. Edit \`prisma/schema.prisma\`: change \`provider = "sqlite"\` to \`provider = "postgresql"\`
3. \`npx prisma db push && npm run seed\`

Or use the provided \`docker-compose.yml\` at the repo root.`;

// ═══════════════════════════════════════════════════════════════════
//  PRISMA
// ═══════════════════════════════════════════════════════════════════

F['prisma/schema.prisma'] = `generator client {
  provider = "prisma-client-js"
}

// Switch provider to "postgresql" for production.
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// ─── Users & profiles ────────────────────────────────────────────
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  name         String?
  passwordHash String
  createdAt    DateTime @default(now())

  profiles     Profile[]
  sessions     Session[]
  subscription Subscription?
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  refreshToken String   @unique
  expiresAt    DateTime
  createdAt    DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model Profile {
  id         String   @id @default(cuid())
  userId     String?
  name       String
  isKids     Boolean  @default(false)
  avatar     String   @default("U")
  accentA    String   @default("#E5007E")
  accentB    String   @default("#4A0E7A")
  createdAt  DateTime @default(now())

  user      User?       @relation(fields: [userId], references: [id], onDelete: Cascade)
  progress  Progress[]
  myList    MyList[]
  downloads Download[]

  @@index([userId])
}

// ─── Catalogue ───────────────────────────────────────────────────
model Title {
  id          String   @id @default(cuid())
  slug        String   @unique
  name        String
  type        String   // SERIES | MOVIE | DOCUMENTARY | REALITY | KIDS | MUSIC | LIVE | SHORT | EDUCATIONAL
  genre       String
  year        Int
  rating      String   // ALL | PG | PG13 | 13 | 16 | 18
  synopsis    String?
  cast        String   @default("[]") // JSON string
  runtimeMins Int?
  isOriginal  Boolean  @default(false)
  isKids      Boolean  @default(false)
  isLive      Boolean  @default(false)
  isFeatured  Boolean  @default(false)
  trend       Int      @default(999)
  posterUrl   String?
  streamUrl   String?
  accentA     String   @default("#E5007E")
  accentB     String   @default("#4A0E7A")
  createdAt   DateTime @default(now())

  seasons  Season[]
  progress Progress[]
  myList   MyList[]
  downloads Download[]
}

model Season {
  id      String    @id @default(cuid())
  titleId String
  number  Int
  title   Title     @relation(fields: [titleId], references: [id], onDelete: Cascade)
  episodes Episode[]

  @@unique([titleId, number])
}

model Episode {
  id          String  @id @default(cuid())
  seasonId    String
  number      Int
  name        String
  synopsis    String?
  runtimeMins Int     @default(40)
  rating      String  @default("PG")
  season      Season  @relation(fields: [seasonId], references: [id], onDelete: Cascade)

  @@unique([seasonId, number])
}

// ─── User data ───────────────────────────────────────────────────
model Progress {
  id        String   @id @default(cuid())
  profileId String
  titleId   String
  position  Int      @default(0)
  duration  Int      @default(0)
  finished  Boolean  @default(false)
  updatedAt DateTime @updatedAt

  profile Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  title   Title   @relation(fields: [titleId], references: [id], onDelete: Cascade)

  @@unique([profileId, titleId])
  @@index([profileId, updatedAt])
}

model MyList {
  id        String   @id @default(cuid())
  profileId String
  titleId   String
  addedAt   DateTime @default(now())

  profile Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  title   Title   @relation(fields: [titleId], references: [id], onDelete: Cascade)

  @@unique([profileId, titleId])
}

model Download {
  id           String   @id @default(cuid())
  profileId    String
  titleId      String
  status       String   @default("READY")
  downloadedAt DateTime @default(now())

  profile Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  title   Title   @relation(fields: [titleId], references: [id], onDelete: Cascade)

  @@unique([profileId, titleId])
}

// ─── Subscriptions ───────────────────────────────────────────────
model Subscription {
  id               String   @id @default(cuid())
  userId           String   @unique
  plan             String   @default("AD_SUPPORTED") // AD_SUPPORTED | AD_LESS
  status           String   @default("ACTIVE")       // ACTIVE | CANCELLED | PAST_DUE
  payfastToken     String?
  currentPeriodEnd DateTime?
  cancelledAt      DateTime?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}`;

F['prisma/seed.ts'] = `import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const TITLES = [
  {
    slug: 'black-power-the-rise', name: 'Black Power: The Rise', type: 'SERIES',
    genre: 'Drama', year: 2026, rating: '16', isOriginal: true, isFeatured: true, trend: 1,
    synopsis: 'Six young entrepreneurs from eMalahleni turn unemployment into opportunity.',
    cast: ['Sipho Ndlovu', 'Lerato Mokoena', 'Thabo Dlamini'],
    accentA: '#E5007E', accentB: '#4A0E7A',
    seasons: [{ number: 1, episodes: ['The Spark','Hustle or Starve','First Client','The Setback','Partners in Power','Going National','The Takeover','Legacy'] }]
  },
  {
    slug: 'emalahleni-nights', name: 'eMalahleni Nights', type: 'MOVIE',
    genre: 'Thriller', year: 2026, rating: '16', isOriginal: true, trend: 2, runtimeMins: 112,
    synopsis: 'A night-shift taxi driver witnesses something he was never meant to see.',
    cast: ['Mandla Zulu', 'Nomsa Khumalo'],
    accentA: '#0F2027', accentB: '#E5007E'
  },
  {
    slug: 'hustle-squad', name: 'The Hustle Squad', type: 'SERIES',
    genre: 'Reality', year: 2026, rating: '13', isOriginal: true, trend: 3,
    synopsis: 'Ten young hustlers. One prize. Zero shortcuts.',
    cast: ['Various'],
    accentA: '#FF8008', accentB: '#4A0E7A',
    seasons: [{ number: 1, episodes: ['Pitch Day','The Grind','Cash Flow','The Pivot','Pressure Test','Team Up','The Fallout','Final Pitch','The Winner','Reunion'] }]
  },
  {
    slug: 'kasi-kings', name: 'Kasi Kings', type: 'SERIES',
    genre: 'Reality', year: 2025, rating: 'PG', trend: 4,
    synopsis: 'The streets have legends. Meet the kings of the kasi.',
    cast: ['Various'],
    accentA: '#F7971E', accentB: '#FFD200'
  },
  {
    slug: 'ubuntu-rising', name: 'Ubuntu Rising', type: 'DOCUMENTARY',
    genre: 'Documentary', year: 2026, rating: 'PG13', isOriginal: true, trend: 5, runtimeMins: 88,
    synopsis: 'Ordinary people rebuilding communities through ubuntu.',
    cast: ['Zanele Mbeki'],
    accentA: '#134E5E', accentB: '#71B280'
  },
  {
    slug: 'joburg-2040', name: 'Joburg 2040', type: 'SERIES',
    genre: 'Sci-Fi', year: 2026, rating: '16', isOriginal: true, trend: 6,
    synopsis: 'In a neon-soaked Johannesburg of 2040, a data courier discovers a dangerous secret.',
    cast: ['Kagiso Mahlangu', 'Aisha Patel'],
    accentA: '#1F1C2C', accentB: '#E5007E',
    seasons: [{ number: 1, episodes: ['Neon Sunrise','The Drop','Ghost Protocol','Free City','The Architect','2040'] }]
  },
  {
    slug: 'soweto-beat', name: 'Soweto Beat', type: 'MUSIC',
    genre: 'Music', year: 2026, rating: 'PG', trend: 7, runtimeMins: 64,
    synopsis: 'The definitive collection of Soweto music videos.',
    cast: ['Various Artists'],
    accentA: '#8E2DE2', accentB: '#E5007E'
  },
  {
    slug: 'little-legends', name: 'Little Legends', type: 'KIDS',
    genre: 'Animation', year: 2026, rating: 'ALL', isKids: true, trend: 8,
    synopsis: 'Thandi the tortoise and Bongi the meerkat learn big lessons.',
    cast: ['Voice cast'],
    accentA: '#00B4DB', accentB: '#0083B0',
    seasons: [{ number: 1, episodes: ['The Big Race','Sharing is Caring','Rainy Day','The Lost Kite','Team Spirit','Brave Little Heart'] }]
  },
  {
    slug: 'mamas-kitchen', name: "Mama's Kitchen", type: 'REALITY',
    genre: 'Food', year: 2025, rating: 'PG', trend: 9,
    synopsis: 'Ten grandmothers. Ten family recipes.',
    cast: ['Various'],
    accentA: '#F2994A', accentB: '#8E0E00'
  },
  {
    slug: 'taxi-wars', name: 'Taxi Wars', type: 'SERIES',
    genre: 'Action Comedy', year: 2026, rating: '16', isOriginal: true, trend: 10,
    synopsis: 'Two rival taxi associations. One route. A driver caught in the middle.',
    cast: ['Skhumbuzo Mahlangu', 'Ntando Duma'],
    accentA: '#FC466B', accentB: '#3F5EFB'
  },
  {
    slug: 'young-hustlers-academy', name: 'Young Hustlers Academy', type: 'EDUCATIONAL',
    genre: 'Business', year: 2026, rating: 'PG', isOriginal: true, trend: 11,
    synopsis: 'A step-by-step course from real founders.',
    cast: ['Matodzi Makananisa'],
    accentA: '#11998E', accentB: '#38EF7D'
  },
  {
    slug: 'jungle-jamboree', name: 'Jungle Jamboree', type: 'KIDS',
    genre: 'Animation', year: 2026, rating: 'ALL', isKids: true, trend: 12,
    synopsis: 'Sing, dance and learn with the animals of Jungle Jamboree!',
    cast: ['Voice cast'],
    accentA: '#43C6AC', accentB: '#191654'
  }
];

async function main() {
  console.log('🌱 Seeding F.A.M.E database...');

  // ── Demo user ─────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('demo1234', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@fame.local' },
    update: {},
    create: {
      email: 'demo@fame.local',
      name: 'Demo User',
      passwordHash,
    },
  });
  console.log('  ✓ User:', user.email);

  // ── Subscription ──────────────────────────────────────────────
  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      plan: 'AD_SUPPORTED',
      status: 'ACTIVE',
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
  console.log('  ✓ Subscription: AD_SUPPORTED');

  // ── Profiles ──────────────────────────────────────────────────
  const profiles = [
    { id: 'p1', name: 'You',    isKids: false, avatar: 'Y', accentA: '#E5007E', accentB: '#4A0E7A' },
    { id: 'p2', name: 'Family', isKids: false, avatar: 'F', accentA: '#11998E', accentB: '#38EF7D' },
    { id: 'pk', name: 'Kids',   isKids: true,  avatar: 'K', accentA: '#00B4DB', accentB: '#0083B0' },
  ];
  for (const p of profiles) {
    await prisma.profile.upsert({
      where: { id: p.id },
      update: p,
      create: { ...p, userId: user.id },
    });
  }
  console.log('  ✓ Profiles:', profiles.map(p => p.name).join(', '));

  // ── Titles ────────────────────────────────────────────────────
  let count = 0;
  for (const t of TITLES) {
    const { seasons, cast, ...data } = t;
    const title = await prisma.title.upsert({
      where: { slug: t.slug },
      update: { ...data, cast: JSON.stringify(cast) },
      create: {
        ...data,
        cast: JSON.stringify(cast),
        seasons: seasons ? {
          create: seasons.map(s => ({
            number: s.number,
            episodes: {
              create: s.episodes.map((name, i) => ({
                number: i + 1,
                name,
                runtimeMins: 40 + (i % 8),
                rating: t.rating,
              })),
            },
          })),
        } : undefined,
      },
    });
    count++;
    console.log('  ✓ Title:', title.name);
  }

  // ── Demo progress + My List for profile p1 ────────────────────
  const featured = await prisma.title.findFirst({ where: { isFeatured: true } });
  if (featured) {
    await prisma.progress.upsert({
      where: { profileId_titleId: { profileId: 'p1', titleId: featured.id } },
      update: {},
      create: {
        profileId: 'p1',
        titleId: featured.id,
        position: 320,
        duration: 1080,
      },
    });
    await prisma.myList.upsert({
      where: { profileId_titleId: { profileId: 'p1', titleId: featured.id } },
      update: {},
      create: { profileId: 'p1', titleId: featured.id },
    });
    console.log('  ✓ Progress + My List for demo profile');
  }

  console.log('\\n✅ Seeded ' + count + ' titles + 1 user + 3 profiles.\\n');
  console.log('   Login:  demo@fame.local / demo1234\\n');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());`;

// ═══════════════════════════════════════════════════════════════════
//  SERVER
// ═══════════════════════════════════════════════════════════════════

F['src/db.ts'] = `import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export function titleToJSON(t: any): any {
  if (!t) return t;
  return {
    ...t,
    cast: typeof t.cast === 'string' ? JSON.parse(t.cast) : t.cast,
    seasons: t.seasons?.map((s: any) => ({
      id: s.id,
      number: s.number,
      episodes: s.episodes?.map((e: any) => ({
        id: e.id,
        number: e.number,
        name: e.name,
        synopsis: e.synopsis,
        runtimeMins: e.runtimeMins,
        rating: e.rating,
      })),
    })),
  };
}`;

F['src/types.ts'] = `import type { FastifyRequest } from 'fastify';

/**
 * Reads the active profile from the X-Profile-Id header.
 * The frontend sets this after the user picks a profile on the gate.
 */
export function getProfileId(req: FastifyRequest): string | null {
  const h = req.headers['x-profile-id'];
  if (typeof h === 'string' && h.length > 0) return h;
  return null;
}

export interface ApiError {
  error: string;
  detail?: string;
}`;

F['src/server.ts'] = `import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import authPlugin from './plugins/auth.js';
import { authRoutes } from './routes/auth.js';
import { profileRoutes } from './routes/profiles.js';
import { catalogueRoutes } from './routes/catalogue.js';
import { progressRoutes } from './routes/progress.js';
import { myListRoutes } from './routes/mylist.js';
import { downloadRoutes } from './routes/downloads.js';
import { subscriptionRoutes } from './routes/subscriptions.js';
import { streamRoutes } from './routes/stream.js';

const app = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: process.env.NODE_ENV === 'production'
      ? undefined
      : { target: 'pino-pretty', options: { colorize: true, translateTime: 'HH:MM:ss' } },
  },
});

async function main() {
  // ── Plugins ───────────────────────────────────────────────────
  await app.register(cors, {
    origin: [
      process.env.WEB_ORIGIN || 'http://localhost:3000',
      'http://localhost:3000',
      'http://localhost:5173',
    ],
    credentials: true,
  });

  await app.register(rateLimit, {
    max: 300,
    timeWindow: '1 minute',
  });

  await app.register(authPlugin);

  // ── Health ────────────────────────────────────────────────────
  app.get('/', async () => ({
    ok: true,
    service: 'fame-api',
    version: '0.1.0',
    time: new Date().toISOString(),
  }));

  app.get('/health', async () => ({ ok: true }));

  // ── Routes ────────────────────────────────────────────────────
  await app.register(authRoutes,         { prefix: '/v1/auth' });
  await app.register(profileRoutes,      { prefix: '/v1/profiles' });
  await app.register(catalogueRoutes,    { prefix: '/v1/catalogue' });
  await app.register(progressRoutes,     { prefix: '/v1/progress' });
  await app.register(myListRoutes,       { prefix: '/v1/mylist' });
  await app.register(downloadRoutes,     { prefix: '/v1/downloads' });
  await app.register(subscriptionRoutes, { prefix: '/v1/subscriptions' });
  await app.register(streamRoutes,       { prefix: '/v1/stream' });

  // ── Error handler ─────────────────────────────────────────────
  app.setErrorHandler((err, _req, reply) => {
    app.log.error(err);
    const status = err.statusCode || 500;
    reply.code(status).send({
      error: err.name || 'Error',
      message: err.message,
    });
  });

  // ── Listen ────────────────────────────────────────────────────
  const port = Number(process.env.PORT || 4000);
  await app.listen({ port, host: '0.0.0.0' });

  console.log('\\n🚀 F.A.M.E API ready at http://localhost:' + port + '\\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});`;

F['src/plugins/auth.ts'] = `import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import type { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    signAccessToken: (payload: { sub: string; email: string }) => string;
    signRefreshToken: (payload: { sub: string }) => string;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { sub: string; email?: string };
    user:    { sub: string; email?: string };
  }
}

const plugin: FastifyPluginAsync = async (app) => {
  await app.register(jwt, {
    secret: process.env.JWT_SECRET || 'dev-secret-change-me',
    sign: { expiresIn: '15m' },
  });

  app.decorate('signAccessToken', (payload) =>
    app.jwt.sign(payload, { expiresIn: '15m' })
  );

  app.decorate('signRefreshToken', (payload) =>
    app.jwt.sign(payload, { expiresIn: '30d' })
  );

  app.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await req.jwtVerify();
    } catch {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
  });
};

export default fp(plugin, { name: 'auth' });`;

// ═══════════════════════════════════════════════════════════════════
//  ROUTES — AUTH
// ═══════════════════════════════════════════════════════════════════

F['src/routes/auth.ts'] = `import type { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../db.js';

const RegisterBody = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const LoginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const RefreshBody = z.object({
  refreshToken: z.string().min(10),
});

export const authRoutes: FastifyPluginAsync = async (app) => {

  // ── Register ──────────────────────────────────────────────────
  app.post('/register', async (req, reply) => {
    const parse = RegisterBody.safeParse(req.body);
    if (!parse.success) {
      return reply.code(400).send({ error: 'Invalid input', detail: parse.error.issues });
    }
    const { name, email, password } = parse.data;

    const exists = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (exists) return reply.code(409).send({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email: email.toLowerCase(), name, passwordHash },
    });

    // Auto-create 3 default profiles for the new account
    await prisma.profile.createMany({
      data: [
        { userId: user.id, name: name.split(' ')[0] || 'You', isKids: false, avatar: (name[0] || 'U').toUpperCase(), accentA: '#E5007E', accentB: '#4A0E7A' },
        { userId: user.id, name: 'Family', isKids: false, avatar: 'F', accentA: '#11998E', accentB: '#38EF7D' },
        { userId: user.id, name: 'Kids',   isKids: true,  avatar: 'K', accentA: '#00B4DB', accentB: '#0083B0' },
      ],
    });

    // Free tier by default
    await prisma.subscription.create({
      data: { userId: user.id, plan: 'AD_SUPPORTED', status: 'ACTIVE' },
    });

    const accessToken = app.signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = app.signRefreshToken({ sub: user.id });

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return reply.code(201).send({
      user: { id: user.id, email: user.email, name: user.name },
      accessToken,
      refreshToken,
    });
  });

  // ── Login ─────────────────────────────────────────────────────
  app.post('/login', async (req, reply) => {
    const parse = LoginBody.safeParse(req.body);
    if (!parse.success) {
      return reply.code(400).send({ error: 'Invalid input' });
    }
    const { email, password } = parse.data;

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) return reply.code(401).send({ error: 'Invalid email or password' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return reply.code(401).send({ error: 'Invalid email or password' });

    const accessToken = app.signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = app.signRefreshToken({ sub: user.id });

    await prisma.session.create({
      data: {
        userId: user.id,
        refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: { id: user.id, email: user.email, name: user.name },
      accessToken,
      refreshToken,
    };
  });

  // ── Refresh ───────────────────────────────────────────────────
  app.post('/refresh', async (req, reply) => {
    const parse = RefreshBody.safeParse(req.body);
    if (!parse.success) return reply.code(400).send({ error: 'Invalid input' });

    const session = await prisma.session.findUnique({
      where: { refreshToken: parse.data.refreshToken },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return reply.code(401).send({ error: 'Invalid or expired refresh token' });
    }

    const accessToken = app.signAccessToken({ sub: session.user.id, email: session.user.email });
    return { accessToken };
  });

  // ── Logout ────────────────────────────────────────────────────
  app.post('/logout', { preHandler: [app.authenticate] }, async (req) => {
    await prisma.session.deleteMany({ where: { userId: req.user.sub } });
    return { ok: true };
  });
};`;

// ═══════════════════════════════════════════════════════════════════
//  ROUTES — PROFILES
// ═══════════════════════════════════════════════════════════════════

F['src/routes/profiles.ts'] = `import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db.js';

const CreateBody = z.object({
  name: z.string().min(1).max(40),
  isKids: z.boolean().optional(),
});

export const profileRoutes: FastifyPluginAsync = async (app) => {

  // List profiles — if X-User-Id header exists, filter by user, else return all
  app.get('/', async (req) => {
    const userId = req.headers['x-user-id'] as string | undefined;
    const profiles = await prisma.profile.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'asc' },
      take: 5,
      select: {
        id: true, name: true, isKids: true, avatar: true,
        accentA: true, accentB: true,
      },
    });
    return profiles;
  });

  // Create profile (auth required)
  app.post('/', { preHandler: [app.authenticate] }, async (req, reply) => {
    const parse = CreateBody.safeParse(req.body);
    if (!parse.success) return reply.code(400).send({ error: 'Invalid input' });
    const { name, isKids } = parse.data;

    const count = await prisma.profile.count({ where: { userId: req.user.sub } });
    if (count >= 5) return reply.code(400).send({ error: 'Maximum 5 profiles per account' });

    const profile = await prisma.profile.create({
      data: {
        userId: req.user.sub,
        name,
        isKids: !!isKids,
        avatar: name[0].toUpperCase(),
        accentA: isKids ? '#00B4DB' : '#E5007E',
        accentB: isKids ? '#0083B0' : '#4A0E7A',
      },
    });
    return reply.code(201).send(profile);
  });

  // Delete profile
  app.delete('/:id', { preHandler: [app.authenticate] }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const profile = await prisma.profile.findUnique({ where: { id } });
    if (!profile || profile.userId !== req.user.sub) {
      return reply.code(404).send({ error: 'Not found' });
    }
    await prisma.profile.delete({ where: { id } });
    return { ok: true };
  });
};`;

// ═══════════════════════════════════════════════════════════════════
//  ROUTES — CATALOGUE
// ═══════════════════════════════════════════════════════════════════

F['src/routes/catalogue.ts'] = `import type { FastifyPluginAsync } from 'fastify';
import { prisma, titleToJSON } from '../db.js';
import { getProfileId } from '../types.js';

export const catalogueRoutes: FastifyPluginAsync = async (app) => {

  // List / filter
  app.get('/', async (req) => {
    const q = req.query as Record<string, string | undefined>;
    const where: any = {};
    if (q.type) where.type = q.type.toUpperCase();
    if (q.year) where.year = parseInt(q.year, 10);
    if (q.original === '1') where.isOriginal = true;
    if (q.kids === '1') where.isKids = true;
    if (q.featured === '1') where.isFeatured = true;

    const items = await prisma.title.findMany({
      where,
      orderBy: [{ trend: 'asc' }, { createdAt: 'desc' }],
      take: q.limit ? parseInt(q.limit, 10) : 50,
    });
    return items.map(titleToJSON);
  });

  // Top 10
  app.get('/top10', async () => {
    const items = await prisma.title.findMany({
      orderBy: { trend: 'asc' },
      take: 10,
    });
    return items.map(titleToJSON);
  });

  // Continue Watching (profile-scoped)
  app.get('/continue-watching', async (req) => {
    const profileId = getProfileId(req);
    if (!profileId) return [];
    const rows = await prisma.progress.findMany({
      where: {
        profileId,
        finished: false,
        position: { gt: 0 },
        duration: { gt: 0 },
      },
      orderBy: { updatedAt: 'desc' },
      take: 10,
      include: { title: true },
    });
    return rows.map((r) => ({
      ...titleToJSON(r.title),
      progress: r.duration > 0 ? r.position / r.duration : 0,
    }));
  });

  // Search
  app.get('/search', async (req) => {
    const q = req.query as Record<string, string | undefined>;
    const where: any = {};
    if (q.type && q.type !== 'all') where.type = q.type.toUpperCase();
    if (q.q) {
      where.OR = [
        { name: { contains: q.q } },
        { genre: { contains: q.q } },
        { synopsis: { contains: q.q } },
      ];
    }
    const items = await prisma.title.findMany({
      where,
      orderBy: { trend: 'asc' },
      take: 40,
    });
    return items.map(titleToJSON);
  });

  // Title detail
  app.get('/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const item = await prisma.title.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      include: { seasons: { include: { episodes: { orderBy: { number: 'asc' } } } } },
    });
    if (!item) return reply.code(404).send({ error: 'Not found' });
    return titleToJSON(item);
  });

  // Similar
  app.get('/:id/similar', async (req, reply) => {
    const { id } = req.params as { id: string };
    const item = await prisma.title.findFirst({ where: { OR: [{ id }, { slug: id }] } });
    if (!item) return reply.code(404).send({ error: 'Not found' });

    const items = await prisma.title.findMany({
      where: {
        id: { not: item.id },
        OR: [{ genre: item.genre }, { type: item.type }],
      },
      take: 8,
    });
    return items.map(titleToJSON);
  });
};`;

// ═══════════════════════════════════════════════════════════════════
//  ROUTES — PROGRESS
// ═══════════════════════════════════════════════════════════════════

F['src/routes/progress.ts'] = `import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { prisma } from '../db.js';
import { getProfileId } from '../types.js';

const UpsertBody = z.object({
  titleId:  z.string().min(1),
  position: z.number().min(0),
  duration: z.number().min(0),
});

export const progressRoutes: FastifyPluginAsync = async (app) => {

  app.get('/:titleId', async (req, reply) => {
    const profileId = getProfileId(req);
    if (!profileId) return reply.code(400).send({ error: 'X-Profile-Id header required' });

    const { titleId } = req.params as { titleId: string };
    const row = await prisma.progress.findUnique({
      where: { profileId_titleId: { profileId, titleId } },
    });

    if (!row) return { position: 0, duration: 0, percent: 0 };
    return {
      position: row.position,
      duration: row.duration,
      percent: row.duration > 0 ? row.position / row.duration : 0,
    };
  });

  app.post('/', async (req, reply) => {
    const profileId = getProfileId(req);
    if (!profileId) return reply.code(400).send({ error: 'X-Profile-Id header required' });

    const parse = UpsertBody.safeParse(req.body);
    if (!parse.success) return reply.code(400).send({ error: 'Invalid input' });

    const { titleId, position, duration } = parse.data;
    const finished = duration > 0 && position / duration > 0.96;

    const row = await prisma.progress.upsert({
      where: { profileId_titleId: { profileId, titleId } },
      create: { profileId, titleId, position, duration, finished },
      update: { position, duration, finished },
    });

    return row;
  });
};`;

// ═══════════════════════════════════════════════════════════════════
//  ROUTES — MY LIST
// ═══════════════════════════════════════════════════════════════════

F['src/routes/mylist.ts'] = `import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { prisma, titleToJSON } from '../db.js';
import { getProfileId } from '../types.js';

const AddBody = z.object({ titleId: z.string().min(1) });

export const myListRoutes: FastifyPluginAsync = async (app) => {

  // Full titles (used by /my-list page)
  app.get('/', async (req, reply) => {
    const profileId = getProfileId(req);
    if (!profileId) return reply.code(400).send({ error: 'X-Profile-Id header required' });

    const rows = await prisma.myList.findMany({
      where: { profileId },
      orderBy: { addedAt: 'desc' },
      include: { title: true },
    });
    return rows.map((r) => titleToJSON(r.title));
  });

  // Just IDs (used by PosterCard for the "+" indicator)
  app.get('/ids', async (req, reply) => {
    const profileId = getProfileId(req);
    if (!profileId) return reply.code(400).send({ error: 'X-Profile-Id header required' });

    const rows = await prisma.myList.findMany({
      where: { profileId },
      select: { titleId: true },
    });
    return rows.map((r) => r.titleId);
  });

  app.post('/', async (req, reply) => {
    const profileId = getProfileId(req);
    if (!profileId) return reply.code(400).send({ error: 'X-Profile-Id header required' });

    const parse = AddBody.safeParse(req.body);
    if (!parse.success) return reply.code(400).send({ error: 'Invalid input' });

    await prisma.myList.upsert({
      where: { profileId_titleId: { profileId, titleId: parse.data.titleId } },
      create: { profileId, titleId: parse.data.titleId },
      update: {},
    });
    return { ok: true };
  });

  app.delete('/:titleId', async (req, reply) => {
    const profileId = getProfileId(req);
    if (!profileId) return reply.code(400).send({ error: 'X-Profile-Id header required' });

    const { titleId } = req.params as { titleId: string };
    await prisma.myList.deleteMany({ where: { profileId, titleId } });
    return { ok: true };
  });
};`;

// ═══════════════════════════════════════════════════════════════════
//  ROUTES — DOWNLOADS
// ═══════════════════════════════════════════════════════════════════

F['src/routes/downloads.ts'] = `import type { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { prisma, titleToJSON } from '../db.js';
import { getProfileId } from '../types.js';

const AddBody = z.object({ titleId: z.string().min(1) });

export const downloadRoutes: FastifyPluginAsync = async (app) => {

  app.get('/', async (req, reply) => {
    const profileId = getProfileId(req);
    if (!profileId) return reply.code(400).send({ error: 'X-Profile-Id header required' });

    const rows = await prisma.download.findMany({
      where: { profileId },
      orderBy: { downloadedAt: 'desc' },
      include: { title: true },
    });
    return rows.map((r) => titleToJSON(r.title));
  });

  app.post('/', async (req, reply) => {
    const profileId = getProfileId(req);
    if (!profileId) return reply.code(400).send({ error: 'X-Profile-Id header required' });

    const parse = AddBody.safeParse(req.body);
    if (!parse.success) return reply.code(400).send({ error: 'Invalid input' });

    await prisma.download.upsert({
      where: { profileId_titleId: { profileId, titleId: parse.data.titleId } },
      create: { profileId, titleId: parse.data.titleId, status: 'READY' },
      update: {},
    });
    return { ok: true };
  });

  app.delete('/:titleId', async (req, reply) => {
    const profileId = getProfileId(req);
    if (!profileId) return reply.code(400).send({ error: 'X-Profile-Id header required' });
    const { titleId } = req.params as { titleId: string };
    await prisma.download.deleteMany({ where: { profileId, titleId } });
    return { ok: true };
  });
};`;

// ═══════════════════════════════════════════════════════════════════
//  ROUTES — SUBSCRIPTIONS
// ═══════════════════════════════════════════════════════════════════

F['src/routes/subscriptions.ts'] = `import type { FastifyPluginAsync } from 'fastify';
import crypto from 'node:crypto';
import { z } from 'zod';
import { prisma } from '../db.js';
import { getProfileId } from '../types.js';

const StartBody = z.object({
  plan: z.enum(['AD_SUPPORTED', 'AD_LESS']),
});

const PRICES: Record<string, string> = {
  AD_SUPPORTED: '29.90',
  AD_LESS: '39.90',
};

function payfastSignature(params: Record<string, string>, passphrase: string): string {
  const ordered = Object.keys(params).sort()
    .map((k) => k + '=' + encodeURIComponent(params[k]).replace(/%20/g, '+'))
    .join('&');
  const withPass = passphrase ? ordered + '&passphrase=' + encodeURIComponent(passphrase) : ordered;
  return crypto.createHash('md5').update(withPass).digest('hex');
}

export const subscriptionRoutes: FastifyPluginAsync = async (app) => {

  // Current plan (profile-scoped for the frontend)
  app.get('/me', async (req, reply) => {
    const profileId = getProfileId(req);
    if (!profileId) {
      return { plan: 'AD_SUPPORTED', status: 'ACTIVE' };
    }
    const profile = await prisma.profile.findUnique({ where: { id: profileId } });
    if (!profile?.userId) return { plan: 'AD_SUPPORTED', status: 'ACTIVE' };

    const sub = await prisma.subscription.findUnique({ where: { userId: profile.userId } });
    return sub
      ? { plan: sub.plan, status: sub.status, currentPeriodEnd: sub.currentPeriodEnd }
      : { plan: 'AD_SUPPORTED', status: 'ACTIVE' };
  });

  // Start PayFast flow (auth required) — returns redirect URL or demo hint
  app.post('/start', { preHandler: [app.authenticate] }, async (req, reply) => {
    const parse = StartBody.safeParse(req.body);
    if (!parse.success) return reply.code(400).send({ error: 'Invalid plan' });

    const merchantId = process.env.PAYFAST_MERCHANT_ID;
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
    const sandbox = process.env.PAYFAST_SANDBOX === 'true';

    // Demo mode — no PayFast credentials configured
    if (!merchantId || !merchantKey) {
      await prisma.subscription.upsert({
        where: { userId: req.user.sub },
        create: { userId: req.user.sub, plan: parse.data.plan, status: 'ACTIVE', currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
        update: { plan: parse.data.plan, status: 'ACTIVE', currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      });
      return {
        demo: true,
        message: 'Plan switched (demo mode — no PayFast credentials).',
        plan: parse.data.plan,
      };
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.sub } });
    if (!user) return reply.code(404).send({ error: 'User not found' });

    const params: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: (process.env.WEB_ORIGIN || 'http://localhost:3000') + '/subscription/success',
      cancel_url: (process.env.WEB_ORIGIN || 'http://localhost:3000') + '/subscription/cancel',
      notify_url: 'http://localhost:' + (process.env.PORT || '4000') + '/v1/subscriptions/itn',
      name_first: (user.name || 'User').split(' ')[0],
      email_address: user.email,
      m_payment_id: 'fame_' + user.id + '_' + Date.now(),
      amount: PRICES[parse.data.plan],
      item_name: 'F.A.M.E ' + (parse.data.plan === 'AD_LESS' ? 'Ad-less' : 'Ad Supported'),
      subscription_type: '1',
      recurring_amount: PRICES[parse.data.plan],
      frequency: '3',
      cycles: '0',
    };
    params.signature = payfastSignature(params, process.env.PAYFAST_PASSPHRASE || '');

    const base = sandbox ? 'https://sandbox.payfast.co.za/eng/process' : 'https://www.payfast.co.za/eng/process';
    const redirectUrl = base + '?' + new URLSearchParams(params).toString();

    return { redirectUrl, paymentId: params.m_payment_id };
  });

  // PayFast ITN webhook
  app.post('/itn', { config: { rateLimit: false } }, async (req, reply) => {
    const body = req.body as Record<string, string>;
    app.log.info({ body }, 'PayFast ITN received');

    // In production: verify signature, re-validate with PayFast, update DB
    // For now, log and accept — the frontend has a proxy that forwards here.
    const paymentId = body.m_payment_id || '';
    const parts = paymentId.split('_');
    if (parts.length >= 2) {
      const userId = parts[1];
      await prisma.subscription.upsert({
        where: { userId },
        create: { userId, plan: 'AD_SUPPORTED', status: 'ACTIVE', payfastToken: body.token, currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
        update: { status: 'ACTIVE', payfastToken: body.token, currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
      });
    }
    return { ok: true };
  });

  // Cancel (auth required)
  app.post('/cancel', { preHandler: [app.authenticate] }, async (req) => {
    await prisma.subscription.update({
      where: { userId: req.user.sub },
      data: { status: 'CANCELLED', cancelledAt: new Date() },
    });
    return { ok: true };
  });
};`;

// ═══════════════════════════════════════════════════════════════════
//  ROUTES — STREAM
// ═══════════════════════════════════════════════════════════════════

F['src/routes/stream.ts'] = `import type { FastifyPluginAsync } from 'fastify';
import { prisma } from '../db.js';

/**
 * Returns playback info for a title.
 * In production this calls Cloudflare Stream to mint a signed token.
 * In demo mode it returns a public sample video so the player works.
 */
const DEMO_HLS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
];

export const streamRoutes: FastifyPluginAsync = async (app) => {
  app.get('/token/:titleId', async (req, reply) => {
    const { titleId } = req.params as { titleId: string };
    const title = await prisma.title.findFirst({
      where: { OR: [{ id: titleId }, { slug: titleId }] },
    });
    if (!title) return reply.code(404).send({ error: 'Title not found' });

    const cfAccount = process.env.CF_ACCOUNT_ID;
    const cfToken = process.env.CF_STREAM_TOKEN;

    // Demo mode — return a public sample so the player works
    if (!cfAccount || !cfToken) {
      const idx = Math.abs(hash(title.id)) % DEMO_HLS.length;
      return {
        demo: true,
        hlsUrl: DEMO_HLS[idx],
        token: 'demo-token',
        duration: (title.runtimeMins || 60) * 60,
      };
    }

    // Production mode — mint a Cloudflare Stream signed token
    // (Simplified; the real implementation uses RS256 + your signing key.)
    const hlsUrl = 'https://customer-' + cfAccount + '.cloudflarestream.com/' + title.streamUrl + '/manifest/video.m3u8';
    return {
      hlsUrl,
      token: 'signed-token-placeholder',
      duration: (title.runtimeMins || 60) * 60,
    };
  });
};

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h) + s.charCodeAt(i) | 0;
  return h;
}`;

// ═══════════════════════════════════════════════════════════════════
//  WRITE EVERYTHING
// ═══════════════════════════════════════════════════════════════════

let count = 0;
for (const [relPath, content] of Object.entries(F)) {
  const full = join(ROOT, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content, 'utf8');
  console.log('  ✓ ' + full);
  count++;
}

// Also drop a docker-compose.yml at the repo root for optional Postgres
const composePath = 'docker-compose.yml';
const composeExists = (() => {
  try { return require('node:fs').existsSync(composePath); } catch { return false; }
})();

if (!composeExists) {
  const compose = `# Optional — only needed if you want PostgreSQL instead of SQLite.
# Usage:  docker compose up -d
services:
  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: fame
      POSTGRES_PASSWORD: fame
      POSTGRES_DB: fame
    ports:
      - "5432:5432"
    volumes:
      - fame_pg:/var/lib/postgresql/data
volumes:
  fame_pg:
`;
  writeFileSync(composePath, compose, 'utf8');
  console.log('  ✓ ' + composePath);
  count++;
}

console.log('\\n✅ Wrote ' + count + ' files to ' + ROOT + '\\n');
console.log('Next steps:');
console.log('  1.  cd apps/api');
console.log('  2.  npm install');
console.log('  3.  npx prisma db push');
console.log('  4.  npm run seed');
console.log('  5.  npm run dev');
console.log('\\nThen in another PowerShell window, restart the frontend:');
console.log('  cd apps/web');
console.log('  npm run dev');
console.log('');