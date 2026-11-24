import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

export interface HistoryDay {
  key: string;
  date: Date;
  label: string;
  overnight: OvernightSleepData[];
  sleepiness: StanfordSleepinessData[];
}

export interface SleepChartDay {
  key: string;
  weekday: string;
  hours: number | null;
  heightPercent: number;
}

export interface HistoryViewModel {
  days: HistoryDay[];
  chart: SleepChartDay[];
  averageSleepMinutes: number | null;
  averageSleepiness: number | null;
  nightsLogged: number;
  ratingsLogged: number;
}

