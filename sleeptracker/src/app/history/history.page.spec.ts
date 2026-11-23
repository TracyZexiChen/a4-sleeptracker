import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController, ToastController } from '@ionic/angular/standalone';
import { provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { SleepService } from '../services/sleep.service';
import { HistoryPage } from './history.page';

describe('HistoryPage', () => {
  let component: HistoryPage;
  let fixture: ComponentFixture<HistoryPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: SleepService,
          useValue: {
            ready: Promise.resolve(),
            changes$: new Subject<void>(),
            getOvernight: () => [],
            getSleepiness: () => [],
          },
        },
        { provide: ModalController, useValue: { create: jasmine.createSpy('create') } },
        { provide: ToastController, useValue: { create: jasmine.createSpy('create') } },
      ],
    });
    fixture = TestBed.createComponent(HistoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
