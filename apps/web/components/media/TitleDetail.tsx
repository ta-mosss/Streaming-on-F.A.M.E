'use client';
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
}