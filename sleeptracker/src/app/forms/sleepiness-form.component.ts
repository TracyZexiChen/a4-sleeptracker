import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonChip,
  IonDatetime,
  IonDatetimeButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonNote,
  IonRadio,
  IonRadioGroup,
  IonTextarea,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { timeOutline } from 'ionicons/icons';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { toLocalISO } from './sleep-form.component';

export interface SleepinessFormValue {
  rating?: number;
  context?: string;
  notes: string;
  loggedAt: string;
}

@Component({
  selector: 'app-sleepiness-form',
  templateUrl: './sleepiness-form.component.html',
  styleUrls: ['./sleepiness-form.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonChip,
    IonDatetime,
    IonDatetimeButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonModal,
    IonNote,
    IonRadio,
    IonRadioGroup,
    IonTextarea,
  ],
})
export class SleepinessFormComponent {
  @Input({ required: true }) value!: SleepinessFormValue;
  @Input({ required: true }) maxDate = '';
  @Input() formId = 'sleepiness';

  readonly levels = [1, 2, 3, 4, 5, 6, 7];
  readonly scale = StanfordSleepinessData.ScaleValues;
  readonly contextOptions = StanfordSleepinessData.ContextOptions;

  constructor() {
    addIcons({ timeOutline });
  }

  get timeId(): string { return `${this.formId}-time`; }

  toggleContext(option: string): void {
    this.value.context = this.value.context === option ? undefined : option;
  }
}

export function createDefaultSleepinessForm(now: Date = new Date()): SleepinessFormValue {
  return { loggedAt: toLocalISO(now), notes: '' };
}

export function sleepinessFormFromRecord(record: StanfordSleepinessData): SleepinessFormValue {
  return {
    rating: record.loggedValue,
    loggedAt: toLocalISO(record.loggedAt),
    context: record.context,
    notes: record.notes ?? '',
  };
}

export function sleepinessFormError(value: SleepinessFormValue, now: Date = new Date()): string | null {
  if (!value.rating) return 'Choose a sleepiness level.';
  if (!value.loggedAt) return 'Choose a time.';
  if (new Date(value.loggedAt).getTime() > now.getTime() + 60000) return 'Time cannot be in the future.';
  return null;
}

export function sleepinessFromForm(value: SleepinessFormValue): StanfordSleepinessData {
  return new StanfordSleepinessData(
    value.rating!,
    new Date(value.loggedAt),
    value.context,
    value.notes.trim() || undefined,
  );
}
