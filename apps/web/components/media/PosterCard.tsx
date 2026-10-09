'use client';
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
      href={`/title/${item.id}`}
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
}