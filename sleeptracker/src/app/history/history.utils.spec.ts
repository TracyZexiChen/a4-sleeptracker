import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { buildHistoryViewModel, formatDuration } from './history.utils';

describe('history utilities', () => {
  it('groups both record types by day and calculates averages', () => {
    const nights = [
      new OvernightSleepData(new Date(2026, 10, 19, 23), new Date(2026, 10, 20, 7)),
      new OvernightSleepData(new Date(2026, 10, 20, 23, 30), new Date(2026, 10, 21, 7)),
    ];
    const ratings = [
      new StanfordSleepinessData(3, new Date(2026, 10, 20, 14)),
      new StanfordSleepinessData(5, new Date(2026, 10, 21, 15)),
    ];

    const result = buildHistoryViewModel(nights, ratings, new Date(2026, 10, 22, 12));

    expect(result.days.map((day) => day.key)).toEqual(['2026-11-21', '2026-11-20']);
    expect(result.days[0].overnight.length).toBe(1);
    expect(result.days[0].sleepiness.length).toBe(1);
    expect(result.averageSleepMinutes).toBe(465);
    expect(result.averageSleepiness).toBe(4);
    expect(result.chart.map((day) => day.hours)).toEqual([null, null, null, null, 8, 7.5, null]);
  });

  it('formats compact durations', () => {
    expect(formatDuration(485)).toBe('8h 5m');
    expect(formatDuration(null)).toBe('—');
  });
});

