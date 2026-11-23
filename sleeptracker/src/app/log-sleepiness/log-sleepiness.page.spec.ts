import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SleepService } from '../services/sleep.service';
import { LogSleepinessPage } from './log-sleepiness.page';

describe('LogSleepinessPage', () => {
  let component: LogSleepinessPage;
  let fixture: ComponentFixture<LogSleepinessPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: SleepService,
          useValue: { addSleepiness: () => Promise.resolve() },
        },
      ],
    });
    fixture = TestBed.createComponent(LogSleepinessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
