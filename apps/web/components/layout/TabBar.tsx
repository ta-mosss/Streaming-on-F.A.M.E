'use client';
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
}