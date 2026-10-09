export default function Loading() {
  return (
    <div>
      <div className="h-[60vh] animate-pulse bg-fame-surface" />
      <div className="space-y-4 p-5">
        <div className="h-8 w-2/3 animate-pulse rounded bg-fame-surface2" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-fame-surface2" />
        <div className="h-12 w-full animate-pulse rounded bg-fame-surface2" />
      </div>
    </div>
  );
}