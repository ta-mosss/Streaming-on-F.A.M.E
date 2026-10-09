import Link from 'next/link';

interface Props {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export function EmptyState({ title, description, ctaHref, ctaLabel }: Props) {
  return (
    <div className="py-16 text-center">
      <h3 className="mb-2 font-display text-lg font-bold">{title}</h3>
      <p className="mx-auto mb-6 max-w-md text-sm text-fame-muted">{description}</p>
      {ctaHref && ctaLabel && (
        <Link
          href={ctaHref}
          className="inline-flex rounded-lg bg-fame-grad px-5 py-3 text-sm font-semibold text-white"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}