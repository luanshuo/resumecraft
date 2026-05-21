// ========================================
// Theme — 亮色/暗色模式，随系统自动切换
// ========================================

export type Theme = 'light' | 'dark';

const THEME_KEY = 'resumecraft-theme';

export function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {}
  return null;
}

export function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
}

export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
}

export function listenSystemTheme(callback: (theme: Theme) => void): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (e: MediaQueryListEvent) => {
    callback(e.matches ? 'dark' : 'light');
  };
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}
