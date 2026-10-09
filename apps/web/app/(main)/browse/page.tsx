import { Suspense } from 'react';
import { HeroBanner } from '@/components/media/HeroBanner';
import { ContentRow } from '@/components/media/ContentRow';
import { RowSkeleton } from '@/components/media/RowSkeleton';
import {
  getHero, getContinueWatching, getTop10,
  getOriginals, getNewReleases, getByType,
} from '@/lib/catalogue';

export default function BrowsePage() {
  return (
    <>
      <Suspense fallback={<div className="h-[70vh] animate-pulse bg-fame-surface" />}>
        <HeroSection />
      </Suspense>
      <div className="pt-6">
        <Suspense fallback={<RowSkeleton />}><ContinueWatchingRow /></Suspense>
        <Suspense fallback={<RowSkeleton />}><Top10Row /></Suspense>
        <Suspense fallback={<RowSkeleton />}><OriginalsRow /></Suspense>
        <Suspense fallback={<RowSkeleton />}><NewReleasesRow /></Suspense>
        <Suspense fallback={<RowSkeleton />}><SeriesRow /></Suspense>
        <Suspense fallback={<RowSkeleton />}><MoviesRow /></Suspense>
      </div>
    </>
  );
}

async function HeroSection() { const h = await getHero(); return h ? <HeroBanner item={h} /> : null; }
async function ContinueWatchingRow() { return <ContentRow title="Continue Watching" items={await getContinueWatching()} variant="progress" />; }
async function Top10Row() { return <ContentRow title="Top 10 in South Africa Today" items={await getTop10()} variant="top10" />; }
async function OriginalsRow() { return <ContentRow title="FAME Originals" items={await getOriginals()} />; }
async function NewReleasesRow() { return <ContentRow title="New Releases" items={await getNewReleases()} />; }
async function SeriesRow() { return <ContentRow title="Series & Reality" items={await getByType('SERIES')} />; }
async function MoviesRow() { return <ContentRow title="Movies" items={await getByType('MOVIE')} />; }