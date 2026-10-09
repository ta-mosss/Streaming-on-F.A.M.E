const BASE = process.env.NEXT_PUBLIC_API_URL ?? '';

export class ApiError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

function activeProfileId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const saved = localStorage.getItem('fame.activeProfile');
    return saved ? JSON.parse(saved)?.id ?? null : null;
  } catch { return null; }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const profileId = activeProfileId();
  if (profileId) headers['X-Profile-Id'] = profileId;

  const res = await fetch(BASE + path, {
    method, headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, text || ('HTTP ' + res.status));
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  get:   <T>(path: string)                 => request<T>('GET', path),
  post:  <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  del:   <T>(path: string)                 => request<T>('DELETE', path),
};