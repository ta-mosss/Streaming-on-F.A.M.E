'use client';
import { createContext, useCallback, useContext, useState } from 'react';
import clsx from 'clsx';

type ToastKind = 'info' | 'success' | 'error';
interface ToastItem { id: number; message: string; kind: ToastKind }
interface ToastContextValue { toast: (message: string, kind?: ToastKind) => void }

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const toast = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, message, kind }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-24 left-1/2 z-[400] flex -translate-x-1/2 flex-col items-center gap-2">
        {items.map((t) => (
          <div
            key={t.id}
            className={clsx(
              'pointer-events-auto rounded-xl border px-5 py-3 text-sm font-semibold shadow-2xl',
              t.kind === 'success' && 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
              t.kind === 'error'   && 'border-rose-400/30 bg-rose-500/10 text-rose-200',
              t.kind === 'info'    && 'border-fame-line bg-fame-surface2 text-white'
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}