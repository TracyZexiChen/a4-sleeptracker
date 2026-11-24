import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import {
  createDefaultSleepForm,
  overnightFromSleepForm,
  sleepFormError,
  sleepFormFromRecord,
  sleepFormWarning,
  toLocalISO,
} from './sleep-form.component';
import {
  sleepinessFormError,
  sleepinessFormFromRecord,
  sleepinessFromForm,
} from './sleepiness-form.component';

describe('shared logging forms', () => {
  it('creates a valid default overnight form', () => {
    const now = new Date(2026, 10, 23, 9, 30);
    const form = createDefaultSleepForm(now);

    expect(sleepFormError(form, now)).toBeNull();
    expect(new Date(form.bedtime).getTime()).toBeLessThan(new Date(form.wakeTime).getTime());
  });

  it('uses the same overnight fields for prefill and output', () => {
    const record = new OvernightSleepData(
      new Date(2026, 10, 22, 23, 0),
      new Date(2026, 10, 23, 7, 0),
      4,
      'Quiet room',
    );
    const rebuilt = overnightFromSleepForm(sleepFormFromRecord(record));

    expect(rebuilt.sleepStart.getTime()).toBe(record.sleepStart.getTime());
    expect(rebuilt.sleepEnd.getTime()).toBe(record.sleepEnd.getTime());
    expect(rebuilt.quality).toBe(4);
    expect(rebuilt.notes).toBe('Quiet room');
  });

  it('shares overnight validation between add and edit', () => {
    const now = new Date(2026, 10, 23, 10, 0);
    const backwards = {
      bedtime: toLocalISO(new Date(2026, 10, 23, 8, 0)),
      wakeTime: toLocalISO(new Date(2026, 10, 23, 7, 0)),
      notes: '',
    };
    const longNight = {
      bedtime: toLocalISO(new Date(2026, 10, 22, 14, 0)),
      wakeTime: toLocalISO(new Date(2026, 10, 23, 7, 0)),
      notes: '',
    };

    expect(sleepFormError(backwards, now)).toContain('after bedtime');
    expect(sleepFormWarning(longNight)).toContain('14 hours');
  });

  it('uses the same sleepiness fields for prefill and output', () => {
    const record = new StanfordSleepinessData(5, new Date(2026, 10, 23, 14, 15), 'In class', 'Long lecture');
    const form = sleepinessFormFromRecord(record);
    const rebuilt = sleepinessFromForm(form);

    expect(sleepinessFormError(form, new Date(2026, 10, 23, 15, 0))).toBeNull();
    expect(rebuilt.loggedValue).toBe(5);
    expect(rebuilt.context).toBe('In class');
    expect(rebuilt.notes).toBe('Long lecture');
  });
});
