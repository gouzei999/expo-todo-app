/**
 * Get the Monday (week start) for a given date.
 * Weeks start on Monday.
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  // getDay() returns 0 for Sunday, 1 for Monday, ... 6 for Saturday
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getWeekEnd(monday: Date): Date {
  const d = new Date(monday);
  d.setDate(d.getDate() + 6);
  return d;
}

export function getWeekNumber(monday: Date): number {
  // ISO week number approximation
  const d = new Date(monday);
  d.setDate(d.getDate() + 3); // Thursday of that week
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const weekNum = Math.ceil(
    ((d.getTime() - jan1.getTime()) / 86400000 + jan1.getDay() + 1) / 7
  );
  return weekNum;
}

export function formatWeekLabel(monday: Date): string {
  const year = monday.getFullYear();
  const weekNum = getWeekNumber(monday);
  const end = getWeekEnd(monday);
  const startStr = `${String(monday.getMonth() + 1).padStart(2, '0')}/${String(monday.getDate()).padStart(2, '0')}`;
  const endStr = `${String(end.getMonth() + 1).padStart(2, '0')}/${String(end.getDate()).padStart(2, '0')}`;
  return `${year}年 第${weekNum}周 (${startStr}-${endStr})`;
}

export function getPreviousWeek(monday: Date): Date {
  const d = new Date(monday);
  d.setDate(d.getDate() - 7);
  return d;
}

export function getNextWeek(monday: Date): Date {
  const d = new Date(monday);
  d.setDate(d.getDate() + 7);
  return d;
}

export function getCurrentWeekStart(): Date {
  return getWeekStart(new Date());
}
