'use client';
import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/Switch';
import { api } from '@/lib/api';

interface Props { user: { name?: string | null; email?: string | null } }

export function ProfileView({ user }: Props) {
  const [subs, setSubs] = useState(true);
  const [autoplay, setAutoplay] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [plan, setPlan] = useState<'AD_SUPPORTED' | 'AD_LESS'>('AD_SUPPORTED');

  useEffect(() => {
    api.get<{ plan: 'AD_SUPPORTED' | 'AD_LESS' }>('/v1/subscriptions/me')
      .then((d) => setPlan(d.plan))
      .catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-2xl p-5">
      <div className="mb-6 flex items-center gap-4">
        <div className="grid h-[76px] w-[76px] place-items-center rounded-[20px] bg-fame-grad font-display text-3xl font-black">
          {(user.name?.[0] ?? user.email?.[0] ?? 'U').toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold">{user.name ?? 'Your profile'}</h1>
          <p className="text-xs text-fame-muted">{user.email}</p>
        </div>
      </div>

      <Tile title="Subscription" subtitle="No hidden fees. Cancel anytime.">
        {(['AD_SUPPORTED', 'AD_LESS'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPlan(p)}
            className="flex w-full items-center gap-3 border-b border-fame-line py-3 text-left last:border-0"
          >
            <span className={'grid h-5 w-5 place-items-center rounded-full border-2 ' +
              (plan === p ? 'border-fame-pink' : 'border-fame-muted')}>
              {plan === p && <span className="h-2.5 w-2.5 rounded-full bg-fame-grad" />}
            </span>
            <span className="flex-1">
              <b className="block text-sm font-semibold">
                {p === 'AD_SUPPORTED' ? 'Ad Supported' : 'Ad-less Experience'}
              </b>
              <span className="text-[11.5px] text-fame-muted">
                {p === 'AD_SUPPORTED' ? 'Ads during viewing' : 'No advertising during viewing'}
              </span>
            </span>
            <span className="font-display text-sm font-extrabold">
              {p === 'AD_SUPPORTED' ? 'R29.90' : 'R39.90'}
            </span>
          </button>
        ))}
      </Tile>

      <Tile title="Preferences">
        <Row label="Subtitles & Captions" hint="English (default)">
          <Switch checked={subs} onChange={setSubs} label="Subtitles" />
        </Row>
        <Row label="Autoplay Next Episode" hint="Plays automatically">
          <Switch checked={autoplay} onChange={setAutoplay} label="Autoplay" />
        </Row>
        <Row label="Data Saver" hint="Stream at 480p on mobile">
          <Switch checked={dataSaver} onChange={setDataSaver} label="Data Saver" />
        </Row>
        <Row label="Push Notifications" hint="New releases & recommendations">
          <Switch checked={notifications} onChange={setNotifications} label="Notifications" />
        </Row>
      </Tile>

      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="mt-3 w-full rounded-xl border border-fame-line bg-fame-surface py-3.5 text-sm font-bold text-rose-400"
      >
        Sign Out
      </button>
    </div>
  );
}

function Tile({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="mb-3.5 rounded-2xl border border-fame-line bg-fame-surface p-5">
      <h3 className="mb-1 text-sm font-bold">{title}</h3>
      {subtitle && <p className="mb-3 text-xs text-fame-muted">{subtitle}</p>}
      {children}
    </section>
  );
}

function Row({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b border-fame-line py-3 last:border-0">
      <div className="flex-1">
        <b className="block text-[13.5px] font-semibold">{label}</b>
        <span className="text-[11.5px] text-fame-muted">{hint}</span>
      </div>
      {children}
    </div>
  );
}