import { OvernightSleepData } from '../data/overnight-sleep-data';
import { SleepData } from '../data/sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { HistoryDay, HistoryViewModel, SleepChartDay } from './history.models';

const DAY_MS = 24 * 60 * 60 * 1000;
const CHART_MAX_HOURS = 12;

export function buildHistoryViewModel(
  overnight: OvernightSleepData[],
  sleepiness: StanfordSleepinessData[],
  now: Date = new Date(),
): HistoryViewModel {
  const groupedDays = new Map<string, HistoryDay>();

  for (const record of overnight) {
    getOrCreateDay(groupedDays, record.sleepEnd).overnight.push(record);
  }
  for (const record of sleepiness) {
    getOrCreateDay(groupedDays, record.loggedAt).sleepiness.push(record);
  }

  const days = [...groupedDays.values()]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map((day) => ({
      ...day,
      overnight: [...day.overnight].sort((a, b) => b.sleepEnd.getTime() - a.sleepEnd.getTime()),
      sleepiness: [...day.sleepiness].sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime()),
    }));

  const durations = overnight
    .map((record) => record.durationMinutes())
    .filter((minutes) => minutes > 0);
  const ratings = sleepiness
    .map((record) => record.loggedValue)
    .filter((value) => value >= 1 && value <= 7);

  return {
    days,
    chart: buildSevenDayChart(overnight, now),
    averageSleepMinutes: average(durations),
    averageSleepiness: average(ratings),
    nightsLogged: durations.length,
    ratingsLogged: ratings.length,
  };
}

export function formatDuration(minutes: number | null): string {
  return minutes === null ? '—' : OvernightSleepData.formatDuration(Math.round(minutes));
}

function buildSevenDayChart(records: OvernightSleepData[], now: Date): SleepChartDay[] {
  const endDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const valuesByDay = new Map<string, number[]>();

  for (const record of records) {
    const minutes = record.durationMinutes();
    if (minutes <= 0) continue;
    const key = record.wakeDayKey();
    valuesByDay.set(key, [...(valuesByDay.get(key) ?? []), minutes]);
  }

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(endDay.getTime() - (6 - index) * DAY_MS);
    const key = SleepData.dayKey(date);
    const values = valuesByDay.get(key) ?? [];
    const hours = values.length ? (average(values) ?? 0) / 60 : null;
    return {
      key,
      weekday: date.toLocaleDateString('en-US', { weekday: 'narrow' }),
      hours,
      heightPercent: hours === null ? 0 : Math.min(100, Math.max(4, (hours / CHART_MAX_HOURS) * 100)),
    };
  });
}

function getOrCreateDay(days: Map<string, HistoryDay>, date: Date): HistoryDay {
  const key = SleepData.dayKey(date);
  const existing = days.get(key);
  if (existing) return existing;

  const day: HistoryDay = {
    key,
    date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    label: date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    }),
    overnight: [],
    sleepiness: [],
  };
  days.set(key, day);
  return day;
}

function average(values: number[]): number | null {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
}

