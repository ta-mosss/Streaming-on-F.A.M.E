'use client';
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
}