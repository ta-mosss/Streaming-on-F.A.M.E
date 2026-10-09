'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Profile } from '@/types/catalogue';

interface Props { children: React.ReactNode }
const STORAGE_KEY = 'fame.activeProfile';

/* Shown immediately — always works, even with no API */
const DEMO_PROFILES: Profile[] = [
  { id: 'p1', name: 'You',    isKids: false, avatar: 'Y', accentA: '#E5007E', accentB: '#4A0E7A' },
  { id: 'p2', name: 'Family', isKids: false, avatar: 'F', accentA: '#11998E', accentB: '#38EF7D' },
  { id: 'pk', name: 'Kids',   isKids: true,  avatar: 'K', accentA: '#00B4DB', accentB: '#0083B0' },
];

export function ProfileGate({ children }: Props) {
  /* Start with demo profiles so the UI never sits empty */
  const [profiles, setProfiles] = useState<Profile[]>(DEMO_PROFILES);
  const [active, setActive] = useState<Profile | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Restore last selected profile
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setActive(JSON.parse(saved)); } catch { /* ignore */ }
    }
    setHydrated(true);

    // Try to upgrade to real profiles from the API (with a 2s timeout)
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);

    fetch((process.env.NEXT_PUBLIC_API_URL ?? '') + '/v1/profiles', {
      signal: controller.signal,
      cache: 'no-store',
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((res) => { if (Array.isArray(res) && res.length) setProfiles(res); })
      .catch(() => { /* API offline — keep demo profiles */ })
      .finally(() => clearTimeout(timer));

    return () => { clearTimeout(timer); controller.abort(); };
  }, []);

  function pick(p: Profile) {
    if (p.isKids) {
      const pin = prompt('Enter Kids Mode PIN (demo PIN: 1234)');
      if (pin !== '1234') return;
    }
    setActive(p);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  }

  if (!hydrated) {
    return (
      <div className="grid min-h-screen place-items-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    );
  }

  if (!active) {
    return (
      <div className="grid min-h-screen place-items-center p-6 text-center">
        <div>
          <h1 className="mb-2 font-display text-3xl font-black">Who&apos;s watching?</h1>
          <p className="mb-10 text-sm text-fame-muted">Choose your profile to continue.</p>
          <div className="flex flex-wrap justify-center gap-5">
            {profiles.map((p) => (
              <button
                key={p.id}
                onClick={() => pick(p)}
                className="flex flex-col items-center gap-2.5 transition active:scale-95"
              >
                <span
                  className="grid h-24 w-24 place-items-center rounded-[22px] font-display text-3xl font-black text-white shadow-lg"
                  style={{ background: `linear-gradient(135deg,${p.accentA},${p.accentB})` }}
                >
                  {p.avatar}
                </span>
                <b className="text-sm text-fame-muted">{p.name}</b>
              </button>
            ))}
          </div>
          <p className="mt-10 text-[11px] text-fame-dim">Demo PIN for Kids: 1234</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}