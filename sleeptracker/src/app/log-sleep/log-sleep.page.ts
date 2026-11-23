import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonNote,
  IonDatetime, IonDatetimeButton, IonModal, IonSegment, IonSegmentButton, IonTextarea,
  IonButton, IonIcon, IonCard, IonCardContent, IonListHeader, IonFooter,
  AlertController, ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { bedOutline, sunnyOutline, warningOutline, checkmarkCircle } from 'ionicons/icons';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';

/* Nights longer than this get a "are you sure?" warning (likely a wrong AM/PM). */
const LONG_NIGHT_MINUTES = 14 * 60;

@Component({
  selector: 'app-log-sleep',
  templateUrl: './log-sleep.page.html',
  styleUrls: ['./log-sleep.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonNote,
    IonDatetime, IonDatetimeButton, IonModal, IonSegment, IonSegmentButton, IonTextarea,
    IonButton, IonIcon, IonCard, IonCardContent, IonListHeader, IonFooter,
    CommonModule, FormsModule,
  ],
})
export class LogSleepPage {
  /* ion-datetime works with ISO strings in local time. */
  bedtime = '';
  wakeTime = '';
  quality?:number;
  notes = '';
  maxDate = '';

  qualityOptions = [1, 2, 3, 4, 5];
  qualityLabels = OvernightSleepData.QualityLabels;

  constructor(
    private sleepService:SleepService,
    private alertCtrl:AlertController,
    private toastCtrl:ToastController,
    private router:Router,
  ) {
    addIcons({ bedOutline, sunnyOutline, warningOutline, checkmarkCircle });
  }

  /* Reset the form every time the tab is opened, so it starts from sensible defaults. */
  ionViewWillEnter() {
    this.resetForm();
  }

  /*
   * Most people log in the morning, so default to a typical night:
   * 11 PM last night -> 7 AM this morning. If it's still before 7 AM,
   * use the current time as the wake-up time (they just got up early).
   */
  resetForm() {
    const now = new Date();
    const wake = new Date(now);
    wake.setHours(7, 0, 0, 0);
    if (now < wake) {
      // Round down to 5 minutes to match the picker's minute steps.
      wake.setTime(now.getTime());
      wake.setMinutes(now.getMinutes() - (now.getMinutes() % 5), 0, 0);
    }
    const bed = new Date(wake);
    bed.setDate(bed.getDate() - 1);
    bed.setHours(23, 0, 0, 0);

    this.bedtime = LogSleepPage.toLocalISO(bed);
    this.wakeTime = LogSleepPage.toLocalISO(wake);
    this.maxDate = LogSleepPage.toLocalISO(now);
    this.quality = undefined;
    this.notes = '';
  }

  get bedDate():Date { return new Date(this.bedtime); }
  get wakeDate():Date { return new Date(this.wakeTime); }

  get durationMinutes():number {
    return Math.round((this.wakeDate.getTime() - this.bedDate.getTime()) / 60000);
  }

  get durationText():string {
    return OvernightSleepData.formatDuration(Math.max(this.durationMinutes, 0));
  }

  /* Error prevention: the save button is disabled while this returns a message. */
  get errorMessage():string | null {
    if (this.durationMinutes <= 0) return 'Wake time is before bedtime.';
    if (this.wakeDate.getTime() > Date.now() + 60000) return 'Wake time is in the future.';
    return null;
  }

  get warningMessage():string | null {
    if (this.durationMinutes > LONG_NIGHT_MINUTES) {
      return 'Over 14 hours. Check AM/PM.';
    }
    return null;
  }

  async save() {
    if (this.errorMessage) return;

    const night = new OvernightSleepData(this.bedDate, this.wakeDate, this.quality, this.notes.trim() || undefined);
    const existing = this.sleepService.getOvernightForDay(this.wakeDate);

    // One night per day: ask before overwriting an existing log.
    if (existing) {
      const alert = await this.alertCtrl.create({
        header: 'Already logged',
        message: `This day already has ${existing.durationString()} (${existing.rangeString()}). Replace it?`,
        buttons: [
          { text: 'Cancel', role: 'cancel' },
          {
            text: 'Replace',
            role: 'destructive',
            handler: () => { this.finishSave(night, existing.id); },
          },
        ],
      });
      await alert.present();
      return;
    }

    await this.finishSave(night);
  }

  private async finishSave(night:OvernightSleepData, replaceId?:string) {
    if (replaceId) {
      await this.sleepService.updateOvernight(replaceId, night);
    } else {
      await this.sleepService.addOvernight(night);
    }

    const toast = await this.toastCtrl.create({
      message: `Saved ${night.durationString()}`,
      duration: 2000,
      position: 'top',
      color: 'success',
      icon: 'checkmark-circle',
    });
    await toast.present();
    this.router.navigateByUrl('/tabs/home');
  }

  /* Format a Date as "YYYY-MM-DDTHH:mm" in local time (what ion-datetime expects). */
  static toLocalISO(date:Date):string {
    const pad = (n:number) => String(n).padStart(2, '0');
    return date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) + ':' + pad(date.getMinutes());
  }
}
