import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const TITLES = [
  { slug: 'black-power-the-rise', name: 'Black Power: The Rise', type: 'SERIES', genre: 'Drama', year: 2026, rating: '16', isOriginal: true, isFeatured: true, trend: 1, synopsis: 'Six young entrepreneurs from eMalahleni turn unemployment into opportunity.', cast: ['Sipho Ndlovu', 'Lerato Mokoena'], accentA: '#E5007E', accentB: '#4A0E7A' },
  { slug: 'emalahleni-nights', name: 'eMalahleni Nights', type: 'MOVIE', genre: 'Thriller', year: 2026, rating: '16', isOriginal: true, trend: 2, runtimeMins: 112, synopsis: 'A night-shift taxi driver witnesses something he was never meant to see.', cast: ['Mandla Zulu'], accentA: '#0F2027', accentB: '#E5007E' },
  { slug: 'hustle-squad', name: 'The Hustle Squad', type: 'SERIES', genre: 'Reality', year: 2026, rating: '13', isOriginal: true, trend: 3, synopsis: 'Ten young hustlers. One prize. Zero shortcuts.', cast: ['Various'], accentA: '#FF8008', accentB: '#4A0E7A' },
  { slug: 'kasi-kings', name: 'Kasi Kings', type: 'SERIES', genre: 'Reality', year: 2025, rating: 'PG', trend: 4, synopsis: 'The streets have legends.', cast: ['Various'], accentA: '#F7971E', accentB: '#FFD200' },
  { slug: 'ubuntu-rising', name: 'Ubuntu Rising', type: 'DOCUMENTARY', genre: 'Documentary', year: 2026, rating: 'PG13', isOriginal: true, trend: 5, runtimeMins: 88, synopsis: 'Ordinary people rebuilding communities through ubuntu.', cast: ['Zanele Mbeki'], accentA: '#134E5E', accentB: '#71B280' },
  { slug: 'little-legends', name: 'Little Legends', type: 'KIDS', genre: 'Animation', year: 2026, rating: 'ALL', isKids: true, trend: 6, synopsis: 'Thandi the tortoise and Bongi the meerkat learn big lessons.', cast: ['Voice cast'], accentA: '#00B4DB', accentB: '#0083B0' },
  { slug: 'joburg-2040', name: 'Joburg 2040', type: 'SERIES', genre: 'Sci-Fi', year: 2026, rating: '16', isOriginal: true, trend: 7, synopsis: 'A data courier discovers a dangerous secret.', cast: ['Kagiso Mahlangu'], accentA: '#1F1C2C', accentB: '#E5007E' },
  { slug: 'taxi-wars', name: 'Taxi Wars', type: 'SERIES', genre: 'Action Comedy', year: 2026, rating: '16', isOriginal: true, trend: 8, synopsis: 'Two rival taxi associations. One route.', cast: ['Skhumbuzo Mahlangu'], accentA: '#FC466B', accentB: '#3F5EFB' }
];

async function main() {
  console.log('🌱 Seeding...');
  const hash = await bcrypt.hash('demo1234', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@fame.local' },
    update: {},
    create: { email: 'demo@fame.local', name: 'Demo User', passwordHash: hash }
  });
  console.log('  ✓ User:', user.email);

  for (const p of [
    { id: 'p1', name: 'You',    isKids: false, avatar: 'Y', accentA: '#E5007E', accentB: '#4A0E7A' },
    { id: 'p2', name: 'Family', isKids: false, avatar: 'F', accentA: '#11998E', accentB: '#38EF7D' },
    { id: 'pk', name: 'Kids',   isKids: true,  avatar: 'K', accentA: '#00B4DB', accentB: '#0083B0' }
  ]) {
    await prisma.profile.upsert({ where: { id: p.id }, update: p, create: { ...p, userId: user.id } });
  }
  console.log('  ✓ Profiles: You, Family, Kids');

  for (const t of TITLES) {
    const { cast, ...rest } = t;
    await prisma.title.upsert({
      where: { slug: t.slug },
      update: { ...rest, cast: JSON.stringify(cast) },
      create: { ...rest, cast: JSON.stringify(cast) }
    });
  }
  console.log('  ✓ Titles:', TITLES.length);

  const featured = await prisma.title.findFirst({ where: { isFeatured: true } });
  if (featured) {
    await prisma.progress.upsert({
      where: { profileId_titleId: { profileId: 'p1', titleId: featured.id } },
      update: {},
      create: { profileId: 'p1', titleId: featured.id, position: 320, duration: 1080 }
    });
    console.log('  ✓ Continue Watching for demo profile');
  }
  console.log('\n✅ Done. Login: demo@fame.local / demo1234\n');
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());