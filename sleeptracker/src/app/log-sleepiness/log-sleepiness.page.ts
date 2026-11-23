import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton,
  IonFooter, ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmarkCircle } from 'ionicons/icons';
import { SleepService } from '../services/sleep.service';
import {
  createDefaultSleepinessForm,
  SleepinessFormComponent,
  SleepinessFormValue,
  sleepinessFormError,
  sleepinessFromForm,
} from '../forms/sleepiness-form.component';
import { toLocalISO } from '../forms/sleep-form.component';

@Component({
  selector: 'app-log-sleepiness',
  templateUrl: './log-sleepiness.page.html',
  styleUrls: ['./log-sleepiness.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton,
    IonFooter, SleepinessFormComponent,
  ],
})
export class LogSleepinessPage {
  form: SleepinessFormValue = createDefaultSleepinessForm();
  maxDate = '';

  constructor(
    private sleepService:SleepService,
    private toastCtrl:ToastController,
    private router:Router,
  ) {
    addIcons({ checkmarkCircle });
    this.resetForm();
  }

  /* Start fresh with "now" as the time every time the tab opens. */
  ionViewWillEnter() {
    this.resetForm();
  }

  private resetForm() {
    const now = new Date();
    this.form = createDefaultSleepinessForm(now);
    this.maxDate = toLocalISO(now);
  }

  get errorMessage(): string | null {
    return sleepinessFormError(this.form);
  }

  async save() {
    if (this.errorMessage) return;
    const entry = sleepinessFromForm(this.form);
    await this.sleepService.addSleepiness(entry);

    const toast = await this.toastCtrl.create({
      message: `Saved level ${entry.loggedValue}`,
      duration: 2000,
      position: 'top',
      color: 'success',
      icon: 'checkmark-circle',
    });
    await toast.present();
    this.router.navigateByUrl('/tabs/home');
  }
}
