'use client';
import useSWR from 'swr';
import { api } from '@/lib/api';

interface ProgressPayload { position: number; duration: number; percent: number }

export function useProgress(titleId: string) {
  const key = titleId ? '/v1/progress/' + titleId : null;
  const { data, mutate } = useSWR<ProgressPayload>(
    key,
    (url: string) => api.get<ProgressPayload>(url),
    { fallbackData: { position: 0, duration: 0, percent: 0 } }
  );

  return {
    position: data?.position ?? 0,
    duration: data?.duration ?? 0,
    percent: data?.percent ?? 0,
    update: async (position: number, duration: number) => {
      await api.post('/v1/progress', { titleId, position, duration });
      mutate();
    },
  };
}