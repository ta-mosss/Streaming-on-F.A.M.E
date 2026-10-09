export function RowSkeleton() {
  return (
    <section className="mt-7 px-5">
      <div className="mb-4 h-5 w-40 animate-pulse rounded bg-fame-surface2" />
      <div className="flex gap-2.5 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-[128px] shrink-0 animate-pulse rounded-xl bg-fame-surface2 sm:w-[150px]"
            style={{ aspectRatio: '2/3' }}
          />
        ))}
      </div>
    </section>
  );
}