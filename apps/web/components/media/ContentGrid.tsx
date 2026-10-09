import type { Title } from '@/types/catalogue';
import { PosterCard } from './PosterCard';

export function ContentGrid({ items }: { items: Title[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3 sm:grid-cols-[repeat(auto-fill,minmax(140px,1fr))]">
      {items.map((item) => (
        <PosterCard key={item.id} item={item} />
      ))}
    </div>
  );
}