import Link from 'next/link';

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
}