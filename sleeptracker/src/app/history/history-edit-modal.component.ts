import { Component, Input, OnInit } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import {
  createDefaultSleepForm,
  overnightFromSleepForm,
  SleepFormComponent,
  SleepFormValue,
  sleepFormError,
  sleepFormFromRecord,
  toLocalISO,
} from '../forms/sleep-form.component';
import {
  createDefaultSleepinessForm,
  SleepinessFormComponent,
  SleepinessFormValue,
  sleepinessFormError,
  sleepinessFormFromRecord,
  sleepinessFromForm,
} from '../forms/sleepiness-form.component';

export type HistoryRecordKind = 'overnight' | 'sleepiness';

export interface EditedHistoryRecord {
  kind: HistoryRecordKind;
  data: OvernightSleepData | StanfordSleepinessData;
}

@Component({
  selector: 'app-history-edit-modal',
  templateUrl: './history-edit-modal.component.html',
  styleUrls: ['./history-edit-modal.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    SleepFormComponent,
    SleepinessFormComponent,
  ],
})
export class HistoryEditModalComponent implements OnInit {
  @Input({ required: true }) kind!: HistoryRecordKind;
  @Input({ required: true }) record!: OvernightSleepData | StanfordSleepinessData;

  sleepForm: SleepFormValue = createDefaultSleepForm();
  sleepinessForm: SleepinessFormValue = createDefaultSleepinessForm();
  readonly maxDate = toLocalISO(new Date());

  constructor(private readonly modalCtrl: ModalController) {}

  ngOnInit(): void {
    if (this.kind === 'overnight') {
      this.sleepForm = sleepFormFromRecord(this.record as OvernightSleepData);
      return;
    }

    this.sleepinessForm = sleepinessFormFromRecord(this.record as StanfordSleepinessData);
  }

  get errorMessage(): string | null {
    return this.kind === 'overnight'
      ? sleepFormError(this.sleepForm)
      : sleepinessFormError(this.sleepinessForm);
  }

  cancel(): void {
    void this.modalCtrl.dismiss(undefined, 'cancel');
  }

  save(): void {
    if (this.kind === 'overnight') {
      if (this.errorMessage) return;
      const night = overnightFromSleepForm(this.sleepForm);
      void this.modalCtrl.dismiss({ kind: this.kind, data: night } satisfies EditedHistoryRecord, 'save');
      return;
    }

    if (this.errorMessage) return;
    const entry = sleepinessFromForm(this.sleepinessForm);
    void this.modalCtrl.dismiss({ kind: this.kind, data: entry } satisfies EditedHistoryRecord, 'save');
  }
}

