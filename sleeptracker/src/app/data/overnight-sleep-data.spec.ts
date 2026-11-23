import { OvernightSleepData } from './overnight-sleep-data';

describe('OvernightSleepData', () => {
  it('should create an instance', () => {
    const start = new Date(2026, 10, 21, 23);
    const end = new Date(2026, 10, 22, 7);
    expect(new OvernightSleepData(start, end)).toBeTruthy();
  });
});
