export const MAX_REMINDERS = 5;

export function normalizeReminderTimes(times: string[]): string[] {
  return [...new Set(times.filter(isValidTime))].sort().slice(0, MAX_REMINDERS);
}

export function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function parseReminderTime(value: string): { hour: number; minute: number } {
  const [hour, minute] = value.split(':').map(Number);
  return { hour, minute };
}

export function formatReminderTime(value: string): string {
  const { hour, minute } = parseReminderTime(value);
  return new Date(2026, 0, 1, hour, minute).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

