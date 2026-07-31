/**
 * Safe date formatting that doesn't rely on Intl locale support.
 * Hermes in React Native may not bundle all ICU locale data,
 * so we avoid toLocaleString with explicit locales.
 */

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '—';
    const y = d.getFullYear();
    const M = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const h = pad(d.getHours());
    const m = pad(d.getMinutes());
    return `${y}-${M}-${day} ${h}:${m}`;
  } catch {
    return '—';
  }
}

export function formatShortDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '—';
    const M = d.getMonth() + 1;
    const day = d.getDate();
    const h = pad(d.getHours());
    const m = pad(d.getMinutes());
    return `${M}月${day}日 ${h}:${m}`;
  } catch {
    return '—';
  }
}

export function formatDateOnly(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '—';
    const y = d.getFullYear();
    const M = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    return `${y}-${M}-${day}`;
  } catch {
    return '—';
  }
}
