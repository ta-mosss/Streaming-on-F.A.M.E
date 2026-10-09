// scaffold.mjs — F.A.M.E apps/web/ file content filler
// Usage:  node scaffold.mjs
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const ROOT = 'apps/web';
const F = {};

// ── Root ─────────────────────────────────────────────────────────────
F['package.json'] = `{
  "name": "@fame/web",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "next": "15.1.0",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "next-auth": "5.0.0-beta.25",
    "@auth/prisma-adapter": "^2.7.4",
    "@prisma/client": "^6.1.0",
    "swr": "^2.2.5",
    "zod": "^3.24.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5",
    "hls.js": "^1.5.17"
  },
  "devDependencies": {
    "@types/node": "^22.10.2",
    "@types/react": "^19.0.2",
    "@types/react-dom": "^19.0.2",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "prisma": "^6.1.0",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.2"
  }
}`;

F['tsconfig.json'] = `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`;

F['next.config.mjs'] = `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'customer-*.cloudflarestream.com' },
      { protocol: 'https', hostname: 'imagedelivery.net' },
    ],
  },
};

export default nextConfig;`;

F['tailwind.config.ts'] = `import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        fame: {
          pink:     '#E5007E',
          purple:   '#4A0E7A',
          magenta:  '#FF168D',
          bg:       '#0A0A0A',
          surface:  '#141414',
          surface2: '#1F1F1F',
          line:     'rgba(255,255,255,0.09)',
          muted:    '#9E9EA8',
          dim:      '#5A5A63',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'fame-grad': 'linear-gradient(135deg,#FF168D 0%,#E5007E 50%,#4A0E7A 100%)',
      },
    },
  },
  plugins: [],
};

export default config;`;

F['postcss.config.mjs'] = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`;

F['.env.example'] = `# API
NEXT_PUBLIC_API_URL=http://localhost:4000

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-a-32-byte-random-string`;

F['.env.local'] = `NEXT_PUBLIC_API_URL=http://localhost:4000
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-only-secret-change-me-in-production-00000000`;

F['.gitignore'] = `node_modules
.pnp
.pnp.js
.next/
out/
build/
.env.local
.env*.local
.DS_Store
*.pem
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.vercel
*.tsbuildinfo
next-env.d.ts`;

F['README.md'] = `# @fame/web — Streaming on F.A.M.E Web App

Next.js 15 App Router frontend for the F.A.M.E VOD platform.

## Run

\`\`\`bash
cp .env.example .env.local
npm install
npm run dev
\`\`\`

Open http://localhost:3000.`;

// ── app/ ─────────────────────────────────────────────────────────────
F['app/globals.css'] = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --fame-pink: #E5007E;
  --fame-purple: #4A0E7A;
  --fame-bg: #0A0A0A;
  --fame-surface: #141414;
  --fame-text: #FFFFFF;
  --fame-muted: #9E9EA8;
}

html, body {
  height: 100%;
  margin: 0;
  background: var(--fame-bg);
  color: var(--fame-text);
  font-family: Inter, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}

* { box-sizing: border-box; }`;

F['app/layout.tsx'] = `import type { Metadata, Viewport } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export const metadata: Metadata = {
  title: 'F.A.M.E — Watch',
  description: "Africa's home of local entertainment.",
  applicationName: 'Streaming on F.A.M.E',
};

export const viewport: Viewport = {
  themeColor: '#0A0A0A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" className={\`\${inter.variable} \${montserrat.variable}\`}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}`;

F['app/page.tsx'] = `import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function Home() {
  const session = await auth();
  redirect(session ? '/browse' : '/login');
}`;

F['app/not-found.tsx'] = `import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center gap-4 p-8 text-center">
      <h1 className="font-display text-5xl font-black">404</h1>
      <p className="text-fame-muted">This title isn&apos;t in the catalogue.</p>
      <Link href="/browse" className="rounded-lg bg-fame-grad px-6 py-3 font-semibold text-white">
        Back to browse
      </Link>
    </main>
  );
}`;

F['app/(auth)/layout.tsx'] = `export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center p-6">
      {children}
    </div>
  );
}`;

F['app/(auth)/login/page.tsx'] = `import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-fame-line bg-fame-surface p-7 shadow-2xl">
      <h1 className="mb-2 font-display text-2xl font-bold">Welcome back</h1>
      <p className="mb-6 text-sm text-fame-muted">Sign in to continue watching.</p>
      <LoginForm />
      <p className="mt-5 text-center text-sm text-fame-muted">
        New to F.A.M.E?{' '}
        <Link href="/register" className="font-bold text-fame-pink hover:underline">Create account</Link>
      </p>
    </div>
  );
}`;

F['app/(auth)/register/page.tsx'] = `import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="w-full max-w-[420px] rounded-2xl border border-fame-line bg-fame-surface p-7 shadow-2xl">
      <h1 className="mb-2 font-display text-2xl font-bold">Create your account</h1>
      <p className="mb-6 text-sm text-fame-muted">Start your F.A.M.E journey in under a minute.</p>
      <RegisterForm />
      <p className="mt-5 text-center text-sm text-fame-muted">
        Already have an account?{' '}
        <Link href="/login" className="font-bold text-fame-pink hover:underline">Sign in</Link>
      </p>
    </div>
  );
}`;

F['app/(main)/layout.tsx'] = `import { TopBar } from '@/components/layout/TopBar';
import { TabBar } from '@/components/layout/TabBar';
import { ProfileGate } from '@/components/layout/ProfileGate';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProfileGate>
      <div className="flex min-h-screen flex-col">
        <TopBar />
        <main className="flex-1 pb-24 pt-14">{children}</main>
        <TabBar />
      </div>
    </ProfileGate>
  );
}`;

F['app/(main)/browse/page.tsx'] = `import { Suspense } from 'react';
import { HeroBanner } from '@/components/media/HeroBanner';
import { ContentRow } from '@/components/media/ContentRow';
import { RowSkeleton } from '@/components/media/RowSkeleton';
import {
  getHero, getContinueWatching, getTop10,
  getOriginals, getNewReleases, getByType,
} from '@/lib/catalogue';

export default function BrowsePage() {
  return (
    <>
      <Suspense fallback={<div className="h-[70vh] animate-pulse bg-fame-surface" />}>
        <HeroSection />
      </Suspense>
      <div className="pt-6">
        <Suspense fallback={<RowSkeleton />}><ContinueWatchingRow /></Suspense>
        <Suspense fallback={<RowSkeleton />}><Top10Row /></Suspense>
        <Suspense fallback={<RowSkeleton />}><OriginalsRow /></Suspense>
        <Suspense fallback={<RowSkeleton />}><NewReleasesRow /></Suspense>
        <Suspense fallback={<RowSkeleton />}><SeriesRow /></Suspense>
        <Suspense fallback={<RowSkeleton />}><MoviesRow /></Suspense>
      </div>
    </>
  );
}

async function HeroSection() { const h = await getHero(); return h ? <HeroBanner item={h} /> : null; }
async function ContinueWatchingRow() { return <ContentRow title="Continue Watching" items={await getContinueWatching()} variant="progress" />; }
async function Top10Row() { return <ContentRow title="Top 10 in South Africa Today" items={await getTop10()} variant="top10" />; }
async function OriginalsRow() { return <ContentRow title="FAME Originals" items={await getOriginals()} />; }
async function NewReleasesRow() { return <ContentRow title="New Releases" items={await getNewReleases()} />; }
async function SeriesRow() { return <ContentRow title="Series & Reality" items={await getByType('SERIES')} />; }
async function MoviesRow() { return <ContentRow title="Movies" items={await getByType('MOVIE')} />; }`;

F['app/(main)/browse/loading.tsx'] = `export default function Loading() {
  return (
    <div className="space-y-8 pt-6">
      <div className="h-[70vh] animate-pulse bg-fame-surface" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="px-5">
          <div className="mb-4 h-5 w-40 animate-pulse rounded bg-fame-surface2" />
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((j) => (
              <div key={j} className="aspect-[2/3] w-[150px] shrink-0 animate-pulse rounded-xl bg-fame-surface2" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}`;

F['app/(main)/title/[id]/page.tsx'] = `import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getTitleById, getSimilar } from '@/lib/catalogue';
import { TitleDetail } from '@/components/media/TitleDetail';
import { ContentRow } from '@/components/media/ContentRow';
import { RowSkeleton } from '@/components/media/RowSkeleton';

interface PageProps { params: Promise<{ id: string }> }

export default async function TitlePage({ params }: PageProps) {
  const { id } = await params;
  const title = await getTitleById(id);
  if (!title) notFound();
  return (
    <div className="pb-12">
      <TitleDetail item={title} />
      <div className="pt-8">
        <Suspense fallback={<RowSkeleton />}>
          <SimilarRow titleId={id} />
        </Suspense>
      </div>
    </div>
  );
}

async function SimilarRow({ titleId }: { titleId: string }) {
  const items = await getSimilar(titleId);
  return items.length ? <ContentRow title="More Like This" items={items} /> : null;
}`;

F['app/(main)/title/[id]/loading.tsx'] = `export default function Loading() {
  return (
    <div>
      <div className="h-[60vh] animate-pulse bg-fame-surface" />
      <div className="space-y-4 p-5">
        <div className="h-8 w-2/3 animate-pulse rounded bg-fame-surface2" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-fame-surface2" />
        <div className="h-12 w-full animate-pulse rounded bg-fame-surface2" />
      </div>
    </div>
  );
}`;

F['app/(main)/search/page.tsx'] = `import { SearchView } from '@/components/search/SearchView';
export default function SearchPage() { return <SearchView />; }`;

F['app/(main)/my-list/page.tsx'] = `import { Suspense } from 'react';
import { getMyList } from '@/lib/catalogue';
import { ContentGrid } from '@/components/media/ContentGrid';
import { RowSkeleton } from '@/components/media/RowSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';

export default function MyListPage() {
  return (
    <div className="p-5">
      <h1 className="mb-1 font-display text-3xl font-black">My List</h1>
      <Suspense fallback={<RowSkeleton />}><Body /></Suspense>
    </div>
  );
}

async function Body() {
  const items = await getMyList();
  if (!items.length) {
    return (
      <EmptyState
        title="Your list is empty"
        description="Tap the + on any poster to save it here for later."
        ctaHref="/browse"
        ctaLabel="Browse the catalogue"
      />
    );
  }
  return <ContentGrid items={items} />;
}`;

F['app/(main)/downloads/page.tsx'] = `import { Suspense } from 'react';
import { getDownloads } from '@/lib/catalogue';
import { ContentGrid } from '@/components/media/ContentGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { RowSkeleton } from '@/components/media/RowSkeleton';

export default function DownloadsPage() {
  return (
    <div className="p-5">
      <h1 className="mb-1 font-display text-3xl font-black">Downloads</h1>
      <p className="mb-5 text-sm text-fame-muted">Watch offline. Save data.</p>
      <Suspense fallback={<RowSkeleton />}><Body /></Suspense>
    </div>
  );
}

async function Body() {
  const items = await getDownloads();
  if (!items.length) {
    return (
      <EmptyState
        title="No downloads yet"
        description="Open a title and tap Download to watch it offline."
        ctaHref="/browse"
        ctaLabel="Find something to watch"
      />
    );
  }
  return <ContentGrid items={items} />;
}`;

F['app/(main)/profile/page.tsx'] = `import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { ProfileView } from '@/components/profile/ProfileView';

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  return <ProfileView user={session.user} />;
}`;

F['app/api/auth/[...nextauth]/route.ts'] = `import { handlers } from '@/lib/auth';
export const { GET, POST } = handlers;`;

F['app/api/itn/route.ts'] = `import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const apiOrigin = process.env.NEXT_PUBLIC_API_URL;
  if (!apiOrigin) {
    return NextResponse.json({ error: 'API not configured' }, { status: 500 });
  }
  const upstream = await fetch(\`\${apiOrigin}/v1/subscriptions/itn\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  return new NextResponse(await upstream.text(), { status: upstream.status });
}`;

// ── components/ui ────────────────────────────────────────────────────
F['components/ui/Button.tsx'] = `'use client';
import clsx from 'clsx';

type Variant = 'primary' | 'ghost' | 'outline';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-fame-grad text-white shadow-[0_10px_30px_rgba(229,0,126,.25)] hover:brightness-110',
  ghost:   'bg-white/[.06] text-white hover:bg-white/[.12]',
  outline: 'border border-fame-line text-white hover:border-fame-pink hover:text-fame-pink',
};

const SIZES: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-5 py-3 text-sm rounded-[10px]',
  lg: 'px-6 py-4 text-base rounded-xl',
};

export function Button({
  variant = 'primary', size = 'md', loading, className, children, disabled, ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center gap-2 font-semibold transition',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'active:scale-[.97]',
        VARIANTS[variant], SIZES[size], className
      )}
    >
      {loading ? '…' : children}
    </button>
  );
}`;

F['components/ui/Sheet.tsx'] = `'use client';
import { useEffect } from 'react';
import clsx from 'clsx';

interface SheetProps { open: boolean; onClose: () => void; children: React.ReactNode }

export function Sheet({ open, onClose, children }: SheetProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <div
        onClick={onClose}
        className={clsx(
          'fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm transition-opacity',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={clsx(
          'fixed left-0 right-0 bottom-0 z-[91] max-h-[92vh] overflow-y-auto',
          'rounded-t-[22px] bg-fame-surface pb-[max(20px,env(safe-area-inset-bottom))]',
          'transition-transform duration-300 ease-out',
          open ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <div className="mx-auto my-2 h-1 w-10 rounded bg-fame-line" />
        {children}
      </div>
    </>
  );
}`;

F['components/ui/Toast.tsx'] = `'use client';
import { createContext, useCallback, useContext, useState } from 'react';
import clsx from 'clsx';

type ToastKind = 'info' | 'success' | 'error';
interface ToastItem { id: number; message: string; kind: ToastKind }
interface ToastContextValue { toast: (message: string, kind?: ToastKind) => void }

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, message, kind }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-24 left-1/2 z-[400] flex -translate-x-1/2 flex-col items-center gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={clsx(
              'pointer-events-auto rounded-xl border px-5 py-3 text-sm font-semibold shadow-2xl',
              t.kind === 'success' && 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
              t.kind === 'error'   && 'border-rose-400/30 bg-rose-500/10 text-rose-200',
              t.kind === 'info'    && 'border-fame-line bg-fame-surface2 text-white'
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}`;

F['components/ui/Switch.tsx'] = `'use client';
import clsx from 'clsx';

interface SwitchProps { checked: boolean; onChange: (v: boolean) => void; label?: string }

export function Switch({ checked, onChange, label }: SwitchProps) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={clsx(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors',
        checked ? 'bg-fame-grad' : 'bg-fame-surface2'
      )}
    >
      <span
        className={clsx(
          'absolute top-[3px] left-[3px] h-[18px] w-[18px] rounded-full bg-white',
          'transition-transform duration-200',
          checked && 'translate-x-[18px]'
        )}
      />
    </button>
  );
}`;

F['components/ui/EmptyState.tsx'] = `import Link from 'next/link';

interface Props {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export function EmptyState({ title, description, ctaHref, ctaLabel }: Props) {
  return (
    <div className="py-16 text-center">
      <h3 className="mb-2 font-display text-lg font-bold">{title}</h3>
      <p className="mx-auto mb-6 max-w-md text-sm text-fame-muted">{description}</p>
      {ctaHref && ctaLabel && (
        <Link
          href={ctaHref}
          className="inline-flex rounded-lg bg-fame-grad px-5 py-3 text-sm font-semibold text-white"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}`;

// ── components/media ─────────────────────────────────────────────────
F['components/media/PosterCard.tsx'] = `'use client';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import type { Title } from '@/types/catalogue';
import { useMyList } from '@/lib/hooks/useMyList';
import { useProgress } from '@/lib/hooks/useProgress';

interface Props { item: Title; showProgress?: boolean; mini?: boolean }

export function PosterCard({ item, showProgress, mini }: Props) {
  const { has, toggle } = useMyList();
  const { percent } = useProgress(item.id);
  const inList = has(item.id);
  const prog = showProgress ? percent : 0;

  return (
    <Link
      href={\`/title/\${item.id}\`}
      className={clsx(
        'group block shrink-0 snap-start transition active:scale-[.96]',
        mini ? 'w-[112px]' : 'w-[128px] sm:w-[150px] lg:w-[172px]'
      )}
    >
      <div
        className="relative aspect-[2/3] overflow-hidden rounded-xl shadow-lg"
        style={{
          background: 'linear-gradient(135deg,' + (item.accentA ?? '#E5007E') + ',' + (item.accentB ?? '#4A0E7A') + ')',
        }}
      >
        {item.posterUrl && (
          <Image
            src={item.posterUrl}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 128px, 172px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" />
        {item.isOriginal && (
          <span className="absolute left-2 top-2 rounded border border-white/30 bg-black/60 px-1.5 py-0.5 text-[8px] font-extrabold tracking-widest">
            ORIGINAL
          </span>
        )}
        {!mini && (
          <button
            onClick={(e) => { e.preventDefault(); toggle(item.id); }}
            aria-label={inList ? 'Remove from My List' : 'Add to My List'}
            className={clsx(
              'absolute right-2 top-2 z-10 grid h-7 w-7 place-items-center rounded-full',
              'border border-white/35 backdrop-blur-sm transition',
              inList ? 'bg-fame-grad' : 'bg-black/60'
            )}
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round">
              {inList ? <path d="M5 13l4 4L19 7" /> : <path d="M12 5v14M5 12h14" />}
            </svg>
          </button>
        )}
        <span className="absolute inset-x-2 bottom-2 font-display text-[11px] font-black uppercase leading-tight text-white [text-shadow:0_2px_10px_rgba(0,0,0,.8)]">
          {item.name}
        </span>
        {prog > 0 && (
          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/25">
            <div className="h-full bg-fame-grad" style={{ width: (prog * 100) + '%' }} />
          </div>
        )}
      </div>
      {!mini && (
        <div className="pt-2">
          <b className="block truncate text-xs font-semibold">{item.name}</b>
          <span className="block truncate text-[10.5px] text-fame-muted">
            {item.type} · {item.year} · {item.rating}
          </span>
        </div>
      )}
    </Link>
  );
}`;

F['components/media/ContentRow.tsx'] = `'use client';
import type { Title } from '@/types/catalogue';
import { PosterCard } from './PosterCard';

interface Props { title: string; items: Title[]; variant?: 'default' | 'top10' | 'progress' }

export function ContentRow({ title, items, variant = 'default' }: Props) {
  if (!items.length) return null;
  return (
    <section className="mt-7">
      <h2 className="px-5 pb-3 font-display text-base font-extrabold">{title}</h2>
      <div
        className="flex gap-2.5 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {items.map((item, i) =>
          variant === 'top10' ? (
            <Top10Card key={item.id} item={item} rank={i + 1} />
          ) : (
            <PosterCard key={item.id} item={item} showProgress={variant === 'progress'} />
          )
        )}
      </div>
    </section>
  );
}

function Top10Card({ item, rank }: { item: Title; rank: number }) {
  return (
    <div className="flex shrink-0 snap-start items-end">
      <span
        className="mb-3 w-16 text-center font-display text-[96px] font-black leading-[.7] tracking-[-.08em]"
        style={{
          background: 'linear-gradient(135deg,#FF168D,#E5007E,#4A0E7A)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {rank}
      </span>
      <PosterCard item={item} mini />
    </div>
  );
}`;

F['components/media/Top10Rail.tsx'] = `// Re-export for naming parity with the folder plan.
export { ContentRow as Top10Rail } from './ContentRow';`;

F['components/media/RowSkeleton.tsx'] = `export function RowSkeleton() {
  return (
    <section className="mt-7 px-5">
      <div className="mb-4 h-5 w-40 animate-pulse rounded bg-fame-surface2" />
      <div className="flex gap-2.5 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-[128px] shrink-0 animate-pulse rounded-xl bg-fame-surface2 sm:w-[150px]"
            style={{ aspectRatio: '2/3' }}
          />
        ))}
      </div>
    </section>
  );
}`;

F['components/media/HeroBanner.tsx'] = `import Link from 'next/link';
import type { Title } from '@/types/catalogue';

export function HeroBanner({ item }: { item: Title }) {
  return (
    <section className="relative flex h-[70vh] min-h-[520px] items-end overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(120deg,' + item.accentA + ',' + item.accentB + ')' }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,.7)_0%,transparent_32%,rgba(10,10,10,.75)_72%,#0A0A0A_100%),linear-gradient(90deg,rgba(10,10,10,.9)_0%,transparent_70%)]" />
      <div className="relative z-10 w-full px-5 pb-8">
        {item.isOriginal && (
          <span className="mb-3 inline-block rounded bg-fame-grad px-2.5 py-1 text-[10px] font-extrabold tracking-widest">
            FAME ORIGINAL
          </span>
        )}
        <h1 className="mb-3 font-display text-4xl font-black uppercase leading-none text-white sm:text-5xl">
          {item.name}
        </h1>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-white/85">
          <span className="rounded border border-white/40 px-1.5 py-0.5">{item.rating}</span>
          <span>{item.year}</span>
          <span className="opacity-50">·</span>
          <span>{item.genre}</span>
          <span className="opacity-50">·</span>
          <span>HD</span>
        </div>
        <p className="mb-5 line-clamp-3 max-w-lg text-sm text-white/85">{item.synopsis}</p>
        <div className="flex gap-2.5">
          <Link
            href={\`/title/\${item.id}?play=1\`}
            className="rounded-[10px] bg-white px-5 py-3 text-sm font-bold text-black transition active:scale-95"
          >
            ▶ Play
          </Link>
          <Link
            href={\`/title/\${item.id}\`}
            className="rounded-[10px] border border-white/20 bg-white/[.08] px-5 py-3 text-sm font-bold text-white backdrop-blur transition active:scale-95"
          >
            More Info
          </Link>
        </div>
      </div>
    </section>
  );
}`;

F['components/media/ContentGrid.tsx'] = `import type { Title } from '@/types/catalogue';
import { PosterCard } from './PosterCard';

export function ContentGrid({ items }: { items: Title[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3 sm:grid-cols-[repeat(auto-fill,minmax(140px,1fr))]">
      {items.map((item) => (
        <PosterCard key={item.id} item={item} />
      ))}
    </div>
  );
}`;

F['components/media/Player.tsx'] = `'use client';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { useProgress } from '@/lib/hooks/useProgress';

interface Props { titleId: string; episode?: number; onClose: () => void }
interface StreamData { hlsUrl: string; token: string; duration?: number }

export function Player({ titleId, episode, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<StreamData | null>(null);
  const [ready, setReady] = useState(false);
  const { update } = useProgress(titleId);

  useEffect(() => {
    const url = '/v1/stream/token/' + titleId + (episode !== undefined ? ('?ep=' + episode) : '');
    api
      .get<StreamData>(url)
      .then(setStream)
      .catch(() => onClose());
  }, [titleId, episode, onClose]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = stream.hlsUrl;
      setReady(true);
    } else {
      import('hls.js').then(({ default: Hls }) => {
        if (!Hls.isSupported()) return;
        const hls = new Hls({
          xhrSetup: (xhr) => xhr.setRequestHeader('Authorization', 'Bearer ' + stream.token),
        });
        hls.loadSource(stream.hlsUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => setReady(true));
        return () => hls.destroy();
      });
    }
  }, [stream]);

  return (
    <div className="fixed inset-0 z-[200] bg-black">
      <button
        onClick={onClose}
        aria-label="Close player"
        className="absolute left-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/60 backdrop-blur"
      >
        ✕
      </button>
      <video
        ref={videoRef}
        controls={ready}
        playsInline
        autoPlay
        className="h-full w-full"
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (Math.floor(v.currentTime) % 5 === 0) {
            update(v.currentTime, v.duration);
          }
        }}
      />
      {!ready && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      )}
    </div>
  );
}`;

F['components/media/TitleDetail.tsx'] = `'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { Title } from '@/types/catalogue';
import { Player } from './Player';
import { useMyList } from '@/lib/hooks/useMyList';

export function TitleDetail({ item }: { item: Title }) {
  const [playing, setPlaying] = useState(false);
  const [episode, setEpisode] = useState(0);
  const { has, toggle } = useMyList();
  const inList = has(item.id);

  if (playing) {
    return (
      <Player
        titleId={item.id}
        episode={item.type === 'SERIES' ? episode : undefined}
        onClose={() => setPlaying(false)}
      />
    );
  }

  return (
    <div>
      <div
        className="relative h-[60vh] min-h-[420px] overflow-hidden"
        style={{ background: 'linear-gradient(140deg,' + item.accentA + ',' + item.accentB + ')' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-fame-bg to-transparent" />
        <h1 className="absolute bottom-5 left-5 right-5 font-display text-3xl font-black uppercase leading-none text-white sm:text-4xl">
          {item.name}
        </h1>
      </div>
      <div className="p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-fame-muted">
          {item.isOriginal && <span className="rounded bg-fame-grad px-2 py-0.5 text-white">ORIGINAL</span>}
          <span className="rounded border border-fame-line px-1.5 py-0.5">{item.rating}</span>
          <span>{item.year}</span>
          <span className="opacity-50">·</span>
          <span>{item.genre}</span>
        </div>
        <div className="mb-5 flex gap-2.5">
          <button
            onClick={() => setPlaying(true)}
            className="flex-1 rounded-[10px] bg-fame-grad px-5 py-3.5 text-sm font-bold text-white shadow-lg active:scale-95"
          >
            ▶ Play
          </button>
          <button
            onClick={() => toggle(item.id)}
            aria-label={inList ? 'Remove from My List' : 'Add to My List'}
            className="grid h-[52px] w-[52px] place-items-center rounded-[10px] border border-fame-line bg-white/[.06]"
          >
            {inList ? '✓' : '+'}
          </button>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-white/85">{item.synopsis}</p>
        <p className="mb-6 text-xs text-fame-muted">
          <span className="text-fame-dim">Cast:</span> {item.cast?.join(', ')}
        </p>
        {item.type === 'SERIES' && item.seasons?.length && (
          <>
            <h3 className="mb-2 text-[10.5px] font-extrabold uppercase tracking-widest text-fame-muted">
              Episodes
            </h3>
            <div>
              {item.seasons[0].episodes.map((ep, i) => (
                <button
                  key={ep.id}
                  onClick={() => { setEpisode(i); setPlaying(true); }}
                  className="flex w-full items-center gap-3 border-b border-fame-line py-3 text-left"
                >
                  <span className="w-6 text-center font-display text-base font-black text-fame-muted">
                    {i + 1}
                  </span>
                  <span className="flex-1">
                    <b className="block text-[13px] font-semibold">{ep.name}</b>
                    <span className="text-[11px] text-fame-muted">{ep.runtimeMins}m · {ep.rating}</span>
                  </span>
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-fame-line">▶</span>
                </button>
              ))}
            </div>
          </>
        )}
        <Link href="/browse" className="mt-8 block text-center text-sm text-fame-muted hover:text-white">
          ← Back to browse
        </Link>
      </div>
    </div>
  );
}`;

// ── components/layout ────────────────────────────────────────────────
F['components/layout/TopBar.tsx'] = `'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function TopBar() {
  const pathname = usePathname();
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-3 border-b border-fame-line bg-fame-bg/90 px-5 backdrop-blur">
      <Link href="/browse" className="flex items-center gap-2">
        <span className="font-display text-lg font-black text-fame-grad">F.A.M.E</span>
      </Link>
      <nav className="ml-4 hidden gap-6 text-sm sm:flex">
        <NavLink href="/browse" active={pathname === '/browse'}>Home</NavLink>
        <NavLink href="/search" active={pathname === '/search'}>Search</NavLink>
        <NavLink href="/my-list" active={pathname === '/my-list'}>My List</NavLink>
      </nav>
    </header>
  );
}

function NavLink({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} className={active ? 'font-semibold text-white' : 'text-fame-muted hover:text-white'}>
      {children}
    </Link>
  );
}`;

F['components/layout/TabBar.tsx'] = `'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const TABS = [
  { href: '/browse', label: 'Home', icon: '⌂' },
  { href: '/search', label: 'Search', icon: '⌕' },
  { href: '/my-list', label: 'My List', icon: '+' },
  { href: '/downloads', label: 'Downloads', icon: '↓' },
  { href: '/profile', label: 'Profile', icon: '○' },
];

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid h-16 grid-cols-5 border-t border-fame-line bg-fame-bg/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      {TABS.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={clsx(
              'relative flex flex-col items-center justify-center gap-0.5 text-[9.5px] font-bold',
              active ? 'text-white' : 'text-fame-muted'
            )}
          >
            {active && <span className="absolute top-0 h-[2.5px] w-7 rounded-b bg-fame-grad" />}
            <span className="text-lg leading-none">{tab.icon}</span>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}`;

F['components/layout/ProfileGate.tsx'] = `'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { Profile } from '@/types/catalogue';

interface Props { children: React.ReactNode }
const STORAGE_KEY = 'fame.activeProfile';

export function ProfileGate({ children }: Props) {
  const [profiles, setProfiles] = useState<Profile[] | null>(null);
  const [active, setActive] = useState<Profile | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setActive(JSON.parse(saved));
    api.get<Profile[]>('/v1/profiles').then(setProfiles).catch(() => setProfiles([]));
  }, []);

  function pick(p: Profile) {
    if (p.isKids) {
      const pin = prompt('Enter Kids Mode PIN (demo PIN: 1234)');
      if (pin !== '1234') return;
    }
    setActive(p);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  }

  if (!active) {
    return (
      <div className="grid min-h-screen place-items-center p-6 text-center">
        <div>
          <h1 className="mb-2 font-display text-3xl font-black">Who&apos;s watching?</h1>
          <p className="mb-10 text-sm text-fame-muted">Choose your profile to continue.</p>
          <div className="flex flex-wrap justify-center gap-5">
            {profiles?.map((p) => (
              <button key={p.id} onClick={() => pick(p)} className="flex flex-col items-center gap-2.5">
                <span
                  className="grid h-24 w-24 place-items-center rounded-[22px] font-display text-3xl font-black text-white"
                  style={{ background: 'linear-gradient(135deg,' + p.accentA + ',' + p.accentB + ')' }}
                >
                  {p.avatar}
                </span>
                <b className="text-sm text-fame-muted">{p.name}</b>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}`;

// ── components/auth ──────────────────────────────────────────────────
F['components/auth/LoginForm.tsx'] = `'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await signIn('credentials', { email, password, redirect: false });
    setLoading(false);
    if (res?.error) { setError('Invalid email or password.'); return; }
    router.push('/browse');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3.5">
      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" />
      <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
      {error && <p className="text-xs font-semibold text-rose-400">{error}</p>}
      <Button type="submit" loading={loading} className="w-full">Sign in</Button>
    </form>
  );
}

function Field({
  label, type, value, onChange, placeholder,
}: { label: string; type: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-fame-muted">
        {label}
      </span>
      <input
        type={type}
        required
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[10px] border border-fame-line bg-fame-bg px-4 py-3 text-[15px] outline-none transition focus:border-fame-pink"
      />
    </label>
  );
}`;

F['components/auth/RegisterForm.tsx'] = `'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/Button';

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await api.post('/v1/auth/register', { name, email, password });
      await signIn('credentials', { email, password, redirect: false });
      router.push('/browse');
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3.5">
      <Field label="Full name" type="text" value={name} onChange={setName} placeholder="e.g. Matodzi Makananisa" />
      <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@email.com" />
      <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="At least 6 characters" />
      {error && <p className="text-xs font-semibold text-rose-400">{error}</p>}
      <Button type="submit" loading={loading} className="w-full">Create account</Button>
    </form>
  );
}

function Field({
  label, type, value, onChange, placeholder,
}: { label: string; type: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-fame-muted">
        {label}
      </span>
      <input
        type={type}
        required
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[10px] border border-fame-line bg-fame-bg px-4 py-3 text-[15px] outline-none transition focus:border-fame-pink"
      />
    </label>
  );
}`;

// ── components/search ────────────────────────────────────────────────
F['components/search/SearchView.tsx'] = `'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import type { Title } from '@/types/catalogue';
import { ContentGrid } from '@/components/media/ContentGrid';
import { EmptyState } from '@/components/ui/EmptyState';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'ORIGINAL', label: 'Originals' },
  { key: 'SERIES', label: 'Series' },
  { key: 'MOVIE', label: 'Movies' },
  { key: 'DOCUMENTARY', label: 'Docs' },
  { key: 'REALITY', label: 'Reality' },
  { key: 'KIDS', label: 'Kids' },
  { key: 'EDUCATIONAL', label: 'Learning' },
];

export function SearchView() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [items, setItems] = useState<Title[]>([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const search = useCallback(async (query: string, category: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      if (category !== 'all') params.set('type', category);
      const res = await api.get<Title[]>('/v1/catalogue/search?' + params.toString());
      setItems(res);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => search(q, cat), 250);
    return () => clearTimeout(timer.current);
  }, [q, cat, search]);

  return (
    <div className="p-5">
      <h1 className="mb-1 font-display text-3xl font-black">Search</h1>
      <p className="mb-5 text-sm text-fame-muted">Find your next African story.</p>

      <div className="mb-3 flex items-center gap-2.5 rounded-xl border border-fame-line bg-fame-surface px-4 py-3 focus-within:border-fame-pink">
        <span className="text-fame-muted">⌕</span>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Titles, genres, cast…"
          className="flex-1 bg-transparent text-[15px] outline-none"
        />
        {q && (
          <button onClick={() => setQ('')} aria-label="Clear" className="text-fame-muted">✕</button>
        )}
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className={
              'shrink-0 rounded-full border px-3.5 py-2 text-xs font-semibold transition ' +
              (cat === c.key
                ? 'border-transparent bg-fame-grad text-white'
                : 'border-fame-line bg-fame-surface text-fame-muted hover:text-white')
            }
          >
            {c.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="py-16 text-center text-sm text-fame-muted">Searching…</p>
      ) : items.length ? (
        <ContentGrid items={items} />
      ) : (
        <EmptyState
          title={q ? 'No results for "' + q + '"' : 'Nothing here yet'}
          description="Try a different title, genre or actor."
        />
      )}
    </div>
  );
}`;

// ── components/profile ───────────────────────────────────────────────
F['components/profile/ProfileView.tsx'] = `'use client';
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
}`;

// ── lib/ ─────────────────────────────────────────────────────────────
F['lib/api.ts'] = `const BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, text || ('HTTP ' + res.status));
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  get:   <T>(path: string)                 => request<T>('GET', path),
  post:  <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  del:   <T>(path: string)                 => request<T>('DELETE', path),
};`;

F['lib/auth.ts'] = `import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { api } from './api';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await api.post<{
            user: { id: string; email: string; name: string };
            accessToken: string;
            refreshToken: string;
          }>('/v1/auth/login', {
            email: credentials.email,
            password: credentials.password,
          });
          return {
            id: res.user.id,
            email: res.user.email,
            name: res.user.name,
            accessToken: res.accessToken,
            refreshToken: res.refreshToken,
          } as any;
        } catch {
          return null;
        }
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.refreshToken = (user as any).refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
});`;

F['lib/auth-provider.tsx'] = `'use client';
import { SessionProvider } from 'next-auth/react';
import { ToastProvider } from '@/components/ui/Toast';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ToastProvider>{children}</ToastProvider>
    </SessionProvider>
  );
}`;

F['lib/catalogue.ts'] = `import { api } from './api';
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
}`;

F['lib/utils.ts'] = `import clsx, { type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function fmtDuration(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h) {
    return h + ':' + String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
  }
  return m + ':' + String(sec).padStart(2, '0');
}`;

F['lib/hooks/useProgress.ts'] = `'use client';
import useSWR from 'swr';
import { api } from '@/lib/api';

interface ProgressPayload { position: number; duration: number; percent: number }

export function useProgress(titleId: string) {
  const key = titleId ? '/v1/progress/' + titleId : null;
  const { data, mutate } = useSWR<ProgressPayload>(
    key,
    (url: string) => api.get<ProgressPayload>(url),
    { fallbackData: { position: 0, duration: 0, percent: 0 } }
  );

  return {
    position: data?.position ?? 0,
    duration: data?.duration ?? 0,
    percent: data?.percent ?? 0,
    update: async (position: number, duration: number) => {
      await api.post('/v1/progress', { titleId, position, duration });
      mutate();
    },
  };
}`;

F['lib/hooks/useMyList.ts'] = `'use client';
import useSWR from 'swr';
import { api } from '@/lib/api';

export function useMyList() {
  const { data, mutate } = useSWR<string[]>(
    '/v1/mylist/ids',
    (url: string) => api.get<string[]>(url),
    { fallbackData: [] }
  );
  const ids = new Set(data ?? []);

  return {
    has: (id: string) => ids.has(id),
    toggle: async (id: string) => {
      if (ids.has(id)) await api.del('/v1/mylist/' + id);
      else await api.post('/v1/mylist', { titleId: id });
      mutate();
    },
  };
}`;

// ── types/ ───────────────────────────────────────────────────────────
F['types/catalogue.ts'] = `export type TitleType =
  | 'SERIES'
  | 'MOVIE'
  | 'DOCUMENTARY'
  | 'REALITY'
  | 'KIDS'
  | 'MUSIC'
  | 'LIVE'
  | 'SHORT'
  | 'EDUCATIONAL';

export interface Title {
  id: string;
  slug?: string;
  name: string;
  type: TitleType;
  genre: string;
  year: number;
  rating: string;
  synopsis?: string;
  cast?: string[];
  runtimeMins?: number;
  isOriginal: boolean;
  isKids: boolean;
  isLive?: boolean;
  posterUrl?: string;
  backdropUrl?: string;
  trailerUrl?: string;
  accentA?: string;
  accentB?: string;
  seasons?: Season[];
}

export interface Season {
  id: string;
  number: number;
  episodes: Episode[];
}

export interface Episode {
  id: string;
  number: number;
  name: string;
  synopsis?: string;
  runtimeMins: number;
  rating: string;
  posterUrl?: string;
}

export interface Profile {
  id: string;
  name: string;
  isKids: boolean;
  avatar: string;
  accentA: string;
  accentB: string;
}

export type Plan = 'AD_SUPPORTED' | 'AD_LESS';
export type SubStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';`;

F['types/auth.d.ts'] = `import 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }
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
console.log('\n✅ Wrote ' + count + ' files to ' + ROOT + '\n');