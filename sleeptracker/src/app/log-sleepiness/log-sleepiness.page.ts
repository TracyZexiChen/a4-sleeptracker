import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonNote,
  IonDatetime, IonDatetimeButton, IonModal, IonTextarea, IonButton, IonIcon, IonChip,
  IonListHeader, IonRadioGroup, IonRadio, IonFooter, ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { timeOutline, checkmarkCircle } from 'ionicons/icons';
import { SleepService } from '../services/sleep.service';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { LogSleepPage } from '../log-sleep/log-sleep.page';

@Component({
  selector: 'app-log-sleepiness',
  templateUrl: './log-sleepiness.page.html',
  styleUrls: ['./log-sleepiness.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonNote,
    IonDatetime, IonDatetimeButton, IonModal, IonTextarea, IonButton, IonIcon, IonChip,
    IonListHeader, IonRadioGroup, IonRadio, IonFooter, CommonModule, FormsModule,
  ],
})
export class LogSleepinessPage {
  /* The seven levels of the Stanford Sleepiness Scale. */
  levels = [1, 2, 3, 4, 5, 6, 7];
  scale = StanfordSleepinessData.ScaleValues;
  contextOptions = StanfordSleepinessData.ContextOptions;

  selected?:number;
  context?:string;
  notes = '';
  loggedAt = '';
  maxDate = '';

  constructor(
    private sleepService:SleepService,
    private toastCtrl:ToastController,
    private router:Router,
  ) {
    addIcons({ timeOutline, checkmarkCircle });
  }

  /* Start fresh with "now" as the time every time the tab opens. */
  ionViewWillEnter() {
    const now = LogSleepPage.toLocalISO(new Date());
    this.selected = undefined;
    this.context = undefined;
    this.notes = '';
    this.loggedAt = now;
    this.maxDate = now;
  }

  /* Tapping a chip again clears it. */
  toggleContext(option:string) {
    this.context = this.context === option ? undefined : option;
  }

  async save() {
    if (!this.selected) return;
    const entry = new StanfordSleepinessData(this.selected, new Date(this.loggedAt), this.context, this.notes.trim() || undefined);
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
