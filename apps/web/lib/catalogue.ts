import { api } from './api';
import type { Title } from '@/types/catalogue';

const DEMO_TITLES: Title[] = [
  { id: 'f01', name: 'Black Power: The Rise', type: 'SERIES', genre: 'Drama', year: 2026,
    rating: '16', synopsis: 'Six young entrepreneurs from eMalahleni turn unemployment into opportunity.',
    cast: ['Sipho Ndlovu', 'Lerato Mokoena'], isOriginal: true, isKids: false,
    accentA: '#E5007E', accentB: '#4A0E7A' },
  { id: 'f02', name: 'eMalahleni Nights', type: 'MOVIE', genre: 'Thriller', year: 2026,
    rating: '16', synopsis: 'A night-shift taxi driver witnesses something he was never meant to see.',
    cast: ['Mandla Zulu'], isOriginal: true, isKids: false, runtimeMins: 112,
    accentA: '#0F2027', accentB: '#E5007E' },
  { id: 'f05', name: 'Ubuntu Rising', type: 'DOCUMENTARY', genre: 'Documentary', year: 2026,
    rating: 'PG13', synopsis: 'Ordinary people rebuilding communities through ubuntu.',
    cast: ['Zanele Mbeki'], isOriginal: true, isKids: false, runtimeMins: 88,
    accentA: '#134E5E', accentB: '#71B280' },
  { id: 'f08', name: 'Little Legends', type: 'KIDS', genre: 'Animation', year: 2026,
    rating: 'ALL', synopsis: 'Thandi the tortoise and Bongi the meerkat learn big lessons.',
    cast: ['Voice cast'], isOriginal: false, isKids: true,
    accentA: '#00B4DB', accentB: '#0083B0' },
];

async function safeGet<T>(path: string, fallback: T): Promise<T> {
  try { return await api.get<T>(path); } catch { return fallback; }
}

export async function getHero(): Promise<Title | null> {
  const items = await safeGet<Title[]>('/v1/catalogue?featured=1', DEMO_TITLES);
  return items[0] ?? null;
}
export async function getContinueWatching(): Promise<Title[]> {
  return safeGet('/v1/catalogue/continue-watching', DEMO_TITLES.slice(0, 3));
}
export async function getTop10(): Promise<Title[]> {
  return safeGet('/v1/catalogue/top10', DEMO_TITLES);
}
export async function getOriginals(): Promise<Title[]> {
  return safeGet('/v1/catalogue?original=1', DEMO_TITLES.filter((t) => t.isOriginal));
}
export async function getNewReleases(): Promise<Title[]> {
  return safeGet('/v1/catalogue?year=2026', DEMO_TITLES);
}
export async function getByType(type: Title['type']): Promise<Title[]> {
  return safeGet('/v1/catalogue?type=' + type, DEMO_TITLES.filter((t) => t.type === type));
}
export async function getTitleById(id: string): Promise<Title | null> {
  const found = DEMO_TITLES.find((t) => t.id === id);
  return safeGet('/v1/catalogue/' + id, found ?? null);
}
export async function getSimilar(id: string): Promise<Title[]> {
  return safeGet('/v1/catalogue/' + id + '/similar', DEMO_TITLES.filter((t) => t.id !== id));
}
export async function getMyList(): Promise<Title[]> {
  return safeGet('/v1/mylist', []);
}
export async function getDownloads(): Promise<Title[]> {
  return safeGet('/v1/downloads', []);
}