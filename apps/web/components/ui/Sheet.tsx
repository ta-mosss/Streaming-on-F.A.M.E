'use client';
import { useEffect } from 'react';
import clsx from 'clsx';

interface SheetProps { open: boolean; onClose: () => void; children: React.ReactNode }

export function Sheet({ open, onClose, children }: SheetProps) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <div
        onClick={onClose}
        className={clsx(
          'fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm transition-opacity',
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={clsx(
          'fixed left-0 right-0 bottom-0 z-[91] max-h-[92vh] overflow-y-auto',
          'rounded-t-[22px] bg-fame-surface pb-[max(20px,env(safe-area-inset-bottom))]',
          'transition-transform duration-300 ease-out',
          open ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <div className="mx-auto my-2 h-1 w-10 rounded bg-fame-line" />
        {children}
      </div>
    </>
  );
}