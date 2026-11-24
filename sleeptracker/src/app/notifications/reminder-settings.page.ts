import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, notificationsOutline, trashOutline } from 'ionicons/icons';
import { MAX_REMINDERS, normalizeReminderTimes } from './reminder.utils';
import { ReminderService } from './reminder.service';

@Component({
  selector: 'app-reminder-settings',
  templateUrl: './reminder-settings.page.html',
  styleUrls: ['./reminder-settings.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonBackButton,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonList,
    IonTitle,
    IonToolbar,
  ],
})
export class ReminderSettingsPage implements OnInit {
  times: string[] = [];
  loaded = false;
  saving = false;
  readonly maxReminders = MAX_REMINDERS;
  readonly isNative = this.reminderService.isNativePlatform;

  constructor(
    private readonly reminderService: ReminderService,
    private readonly toastCtrl: ToastController,
  ) {
    addIcons({ addOutline, notificationsOutline, trashOutline });
  }

  async ngOnInit(): Promise<void> {
    await this.reminderService.initialize();
    this.times = await this.reminderService.getTimes();
    this.loaded = true;
  }

  addTime(): void {
    if (this.times.length >= MAX_REMINDERS) return;
    const suggestions = ['09:00', '14:00', '21:00'];
    this.times.push(suggestions.find((time) => !this.times.includes(time)) ?? '12:00');
  }

  removeTime(index: number): void {
    this.times.splice(index, 1);
  }

  async save(): Promise<void> {
    this.saving = true;
    try {
      const result = await this.reminderService.saveTimes(this.times);
      this.times = result.times;
      const toast = await this.toastCtrl.create({
        message: result.scheduledNatively
          ? `${result.times.length} daily reminder${result.times.length === 1 ? '' : 's'} scheduled`
          : 'Times saved',
        duration: 3200,
        position: 'top',
        color: result.scheduledNatively ? 'success' : 'medium',
      });
      await toast.present();
    } catch (error) {
      const toast = await this.toastCtrl.create({
        message: error instanceof Error ? error.message : 'Could not schedule reminders.',
        duration: 3200,
        position: 'top',
        color: 'danger',
      });
      await toast.present();
    } finally {
      this.saving = false;
    }
  }

  get normalizedCount(): number {
    return normalizeReminderTimes(this.times).length;
  }
}

