import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonDatetime,
  IonDatetimeButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonTextarea,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bedOutline, sunnyOutline, warningOutline } from 'ionicons/icons';
import { OvernightSleepData } from '../data/overnight-sleep-data';

const LONG_NIGHT_MINUTES = 14 * 60;

export interface SleepFormValue {
  bedtime: string;
  wakeTime: string;
  quality?: number;
  notes: string;
}

@Component({
  selector: 'app-sleep-form',
  templateUrl: './sleep-form.component.html',
  styleUrls: ['./sleep-form.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonDatetime,
    IonDatetimeButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonModal,
    IonNote,
    IonSegment,
    IonSegmentButton,
    IonTextarea,
  ],
})
export class SleepFormComponent {
  @Input({ required: true }) value!: SleepFormValue;
  @Input({ required: true }) maxDate = '';
  @Input() formId = 'sleep';

  readonly qualityOptions = [1, 2, 3, 4, 5];
  readonly qualityLabels = OvernightSleepData.QualityLabels;

  constructor() {
    addIcons({ bedOutline, sunnyOutline, warningOutline });
  }

  get bedtimeId(): string { return `${this.formId}-bedtime`; }
  get wakeTimeId(): string { return `${this.formId}-waketime`; }
  get errorMessage(): string | null { return sleepFormError(this.value); }
  get warningMessage(): string | null { return sleepFormWarning(this.value); }
}

export function createDefaultSleepForm(now: Date = new Date()): SleepFormValue {
  const wake = new Date(now);
  wake.setHours(7, 0, 0, 0);
  if (now < wake) {
    wake.setTime(now.getTime());
    wake.setMinutes(now.getMinutes() - (now.getMinutes() % 5), 0, 0);
  }

  const bed = new Date(wake);
  bed.setDate(bed.getDate() - 1);
  bed.setHours(23, 0, 0, 0);

  return { bedtime: toLocalISO(bed), wakeTime: toLocalISO(wake), notes: '' };
}

export function sleepFormFromRecord(record: OvernightSleepData): SleepFormValue {
  return {
    bedtime: toLocalISO(record.sleepStart),
    wakeTime: toLocalISO(record.sleepEnd),
    quality: record.quality,
    notes: record.notes ?? '',
  };
}

export function sleepFormDurationMinutes(value: SleepFormValue): number {
  return Math.round((new Date(value.wakeTime).getTime() - new Date(value.bedtime).getTime()) / 60000);
}

export function sleepFormError(value: SleepFormValue, now: Date = new Date()): string | null {
  if (!value.bedtime || !value.wakeTime) return 'Choose both times.';
  if (sleepFormDurationMinutes(value) <= 0) return 'Wake time must be after bedtime.';
  if (new Date(value.wakeTime).getTime() > now.getTime() + 60000) return 'Wake time cannot be in the future.';
  return null;
}

export function sleepFormWarning(value: SleepFormValue): string | null {
  return sleepFormDurationMinutes(value) > LONG_NIGHT_MINUTES ? 'Over 14 hours. Check AM/PM.' : null;
}

export function overnightFromSleepForm(value: SleepFormValue): OvernightSleepData {
  return new OvernightSleepData(
    new Date(value.bedtime),
    new Date(value.wakeTime),
    value.quality,
    value.notes.trim() || undefined,
  );
}

export function toLocalISO(date: Date): string {
  const pad = (part: number) => String(part).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
