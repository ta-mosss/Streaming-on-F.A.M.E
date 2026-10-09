import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getTitleById, getSimilar } from '@/lib/catalogue';
import { TitleDetail } from '@/components/media/TitleDetail';
import { ContentRow } from '@/components/media/ContentRow';
import { RowSkeleton } from '@/components/media/RowSkeleton';

interface PageProps { params: Promise<{ id: string }> }

export default async function TitlePage({ params }: PageProps) {
  const { id } = await params;
  const title = await getTitleById(id);
  if (!title) notFound();
  return (
    <div className="pb-12">
      <TitleDetail item={title} />
      <div className="pt-8">
        <Suspense fallback={<RowSkeleton />}>
          <SimilarRow titleId={id} />
        </Suspense>
      </div>
    </div>
  );
}

async function SimilarRow({ titleId }: { titleId: string }) {
  const items = await getSimilar(titleId);
  return items.length ? <ContentRow title="More Like This" items={items} /> : null;
}