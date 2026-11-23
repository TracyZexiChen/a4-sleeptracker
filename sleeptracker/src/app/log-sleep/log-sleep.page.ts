import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonButton, IonCard, IonCardContent, IonFooter,
  AlertController, ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import {
  createDefaultSleepForm,
  overnightFromSleepForm,
  SleepFormComponent,
  SleepFormValue,
  sleepFormDurationMinutes,
  sleepFormError,
  sleepFormWarning,
  toLocalISO,
} from '../forms/sleep-form.component';

@Component({
  selector: 'app-log-sleep',
  templateUrl: './log-sleep.page.html',
  styleUrls: ['./log-sleep.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar,
    IonButton, IonCard, IonCardContent, IonFooter, SleepFormComponent,
  ],
})
export class LogSleepPage {
  form: SleepFormValue = createDefaultSleepForm();
  maxDate = '';

  constructor(
    private sleepService:SleepService,
    private alertCtrl:AlertController,
    private toastCtrl:ToastController,
    private router:Router,
  ) {
    addIcons({ checkmarkCircle });
    this.resetForm();
  }

  /* Reset the form every time the tab is opened, so it starts from sensible defaults. */
  ionViewWillEnter() {
    this.resetForm();
  }

  resetForm() {
    const now = new Date();
    this.form = createDefaultSleepForm(now);
    this.maxDate = toLocalISO(now);
  }

  get durationMinutes():number {
    return sleepFormDurationMinutes(this.form);
  }

  get durationText():string {
    return OvernightSleepData.formatDuration(Math.max(this.durationMinutes, 0));
  }

  /* Error prevention: the save button is disabled while this returns a message. */
  get errorMessage():string | null {
    return sleepFormError(this.form);
  }

  get warningMessage():string | null {
    return sleepFormWarning(this.form);
  }

  async save() {
    if (this.errorMessage) return;

    const night = overnightFromSleepForm(this.form);
    const existing = this.sleepService.getOvernightForDay(night.sleepEnd);

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
}
