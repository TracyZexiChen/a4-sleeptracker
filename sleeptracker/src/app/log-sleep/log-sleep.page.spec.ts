import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SleepService } from '../services/sleep.service';
import { LogSleepPage } from './log-sleep.page';

describe('LogSleepPage', () => {
  let component: LogSleepPage;
  let fixture: ComponentFixture<LogSleepPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: SleepService,
          useValue: {
            getOvernightForDay: () => undefined,
            addOvernight: () => Promise.resolve(),
            updateOvernight: () => Promise.resolve(),
          },
        },
      ],
    });
    fixture = TestBed.createComponent(LogSleepPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
