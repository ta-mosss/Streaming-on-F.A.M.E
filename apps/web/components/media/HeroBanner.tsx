import Link from 'next/link';
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
            href={`/title/${item.id}?play=1`}
            className="rounded-[10px] bg-white px-5 py-3 text-sm font-bold text-black transition active:scale-95"
          >
            ▶ Play
          </Link>
          <Link
            href={`/title/${item.id}`}
            className="rounded-[10px] border border-white/20 bg-white/[.08] px-5 py-3 text-sm font-bold text-white backdrop-blur transition active:scale-95"
          >
            More Info
          </Link>
        </div>
      </div>
    </section>
  );
}