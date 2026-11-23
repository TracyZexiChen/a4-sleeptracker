import { TestBed } from '@angular/core/testing';

import { SleepService } from './sleep.service';
import { StorageService } from './storage.service';

describe('SleepService', () => {
  let service: SleepService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{
        provide: StorageService,
        useValue: {
          get: () => Promise.resolve(null),
          set: () => Promise.resolve(),
        },
      }],
    });
    service = TestBed.inject(SleepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
