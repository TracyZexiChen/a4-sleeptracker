import { formatReminderTime, normalizeReminderTimes, parseReminderTime } from './reminder.utils';

describe('reminder utilities', () => {
  it('validates, sorts, and de-duplicates reminder times', () => {
    expect(normalizeReminderTimes(['14:00', '09:00', '14:00', '25:00', '']))
      .toEqual(['09:00', '14:00']);
  });

  it('parses and formats a reminder time', () => {
    expect(parseReminderTime('21:15')).toEqual({ hour: 21, minute: 15 });
    expect(formatReminderTime('21:15')).toBe('9:15 PM');
  });
});

