let initialized = false;

export function initAnalytics() {
  if (initialized) return;
  initialized = true;
  const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;
  if (!domain) return;
  const script = document.createElement('script');
  script.defer = true;
  script.dataset.domain = domain;
  script.src = (import.meta.env.VITE_PLAUSIBLE_SCRIPT as string | undefined) || 'https://plausible.io/js/script.js';
  document.head.appendChild(script);
}

export function track(event: string, props: Record<string, string | number | boolean> = {}) {
  const payload = { event, props, path: window.location.pathname };
  window.dispatchEvent(new CustomEvent('fame:analytics', { detail: payload }));
  const plausible = (window as unknown as { plausible?: (name: string, options?: unknown) => void }).plausible;
  if (plausible) plausible(event, { props });
}
