'use client';
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
}