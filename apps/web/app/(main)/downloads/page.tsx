import { Suspense } from 'react';
import { getDownloads } from '@/lib/catalogue';
import { ContentGrid } from '@/components/media/ContentGrid';
import { EmptyState } from '@/components/ui/EmptyState';
import { RowSkeleton } from '@/components/media/RowSkeleton';

export default function DownloadsPage() {
  return (
    <div className="p-5">
      <h1 className="mb-1 font-display text-3xl font-black">Downloads</h1>
      <p className="mb-5 text-sm text-fame-muted">Watch offline. Save data.</p>
      <Suspense fallback={<RowSkeleton />}><Body /></Suspense>
    </div>
  );
}

async function Body() {
  const items = await getDownloads();
  if (!items.length) {
    return (
      <EmptyState
        title="No downloads yet"
        description="Open a title and tap Download to watch it offline."
        ctaHref="/browse"
        ctaLabel="Find something to watch"
      />
    );
  }
  return <ContentGrid items={items} />;
}