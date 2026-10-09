import { Suspense } from 'react';
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
}