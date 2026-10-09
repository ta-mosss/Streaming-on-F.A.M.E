'use client';
import useSWR from 'swr';
import { api } from '@/lib/api';

export function useMyList() {
  const { data, mutate } = useSWR<string[]>(
    '/v1/mylist/ids',
    (url: string) => api.get<string[]>(url),
    { fallbackData: [] }
  );
  const ids = new Set(data ?? []);

  return {
    has: (id: string) => ids.has(id),
    toggle: async (id: string) => {
      if (ids.has(id)) await api.del('/v1/mylist/' + id);
      else await api.post('/v1/mylist', { titleId: id });
      mutate();
    },
  };
}