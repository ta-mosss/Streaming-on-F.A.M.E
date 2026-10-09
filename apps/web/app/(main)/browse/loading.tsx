export default function Loading() {
  return (
    <div className="space-y-8 pt-6">
      <div className="h-[70vh] animate-pulse bg-fame-surface" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="px-5">
          <div className="mb-4 h-5 w-40 animate-pulse rounded bg-fame-surface2" />
          <div className="flex gap-3">
            {[1, 2, 3, 4, 5].map((j) => (
              <div key={j} className="aspect-[2/3] w-[150px] shrink-0 animate-pulse rounded-xl bg-fame-surface2" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}