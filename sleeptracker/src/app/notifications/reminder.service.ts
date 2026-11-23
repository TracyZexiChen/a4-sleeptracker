import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { StorageService } from '../services/storage.service';
import { normalizeReminderTimes, parseReminderTime } from './reminder.utils';

const STORAGE_KEY = 'sleepinessReminderTimes';
const FIRST_NOTIFICATION_ID = 7300;
const LAST_NOTIFICATION_ID = 7399;

export interface ReminderSaveResult {
  times: string[];
  scheduledNatively: boolean;
}

@Injectable({ providedIn: 'root' })
export class ReminderService {
  private initialized = false;

  constructor(
    private readonly storage: StorageService,
    private readonly router: Router,
  ) {}

  get isNativePlatform(): boolean {
    return Capacitor.isNativePlatform();
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;
    await LocalNotifications.addListener('localNotificationActionPerformed', (event) => {
      if (event.notification.extra?.['route'] === '/tabs/log-sleepiness') {
        void this.router.navigateByUrl('/tabs/log-sleepiness');
      }
    });
  }

  async getTimes(): Promise<string[]> {
    return normalizeReminderTimes((await this.storage.get(STORAGE_KEY)) ?? []);
  }

  async saveTimes(times: string[]): Promise<ReminderSaveResult> {
    const normalized = normalizeReminderTimes(times);
    await this.storage.set(STORAGE_KEY, normalized);

    if (!this.isNativePlatform) {
      return { times: normalized, scheduledNatively: false };
    }

    if (!normalized.length) {
      await this.cancelAppReminders();
      return { times: normalized, scheduledNatively: true };
    }

    const currentPermission = await LocalNotifications.checkPermissions();
    const permission = currentPermission.display === 'granted'
      ? currentPermission
      : await LocalNotifications.requestPermissions();
    if (permission.display !== 'granted') {
      throw new Error('Notification permission was not granted.');
    }

    await this.cancelAppReminders();
    if (normalized.length) {
      await LocalNotifications.schedule({
        notifications: normalized.map((time, index) => {
          const { hour, minute } = parseReminderTime(time);
          return {
            id: FIRST_NOTIFICATION_ID + index,
            title: 'How sleepy are you?',
            body: 'Take a quick Stanford Sleepiness Scale check-in.',
            schedule: { on: { hour, minute }, repeats: true, allowWhileIdle: true },
            extra: { route: '/tabs/log-sleepiness' },
          };
        }),
      });
    }

    return { times: normalized, scheduledNatively: true };
  }

  private async cancelAppReminders(): Promise<void> {
    const pending = await LocalNotifications.getPending();
    const appReminders = pending.notifications
      .filter((notification) => notification.id >= FIRST_NOTIFICATION_ID && notification.id <= LAST_NOTIFICATION_ID)
      .map((notification) => ({ id: notification.id }));
    if (appReminders.length) {
      await LocalNotifications.cancel({ notifications: appReminders });
    }
  }
}

