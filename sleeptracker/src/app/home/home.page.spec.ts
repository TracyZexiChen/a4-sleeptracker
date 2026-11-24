import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Subject } from 'rxjs';

import { HomePage } from './home.page';
import { SleepService } from '../services/sleep.service';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: SleepService,
          useValue: {
            ready: Promise.resolve(),
            changes$: new Subject<void>(),
            getOvernightForDay: () => undefined,
            getSleepinessForDay: () => [],
            getOvernight: () => [],
          },
        },
      ],
    });
    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
