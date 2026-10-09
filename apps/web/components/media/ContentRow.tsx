'use client';
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
}