import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle,
  IonCardSubtitle, IonCardContent, IonButton, IonIcon, IonNote,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { moon, addCircleOutline, cafeOutline, createOutline } from 'ionicons/icons';
import { SleepService } from '../services/sleep.service';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

/*
 * "Today" is the first screen people see. It answers the two questions they
 * usually open the app for: did I log last night, and how have I felt today?
 * Each card links straight to the matching logging tab.
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle,
    IonCardSubtitle, IonCardContent, IonButton, IonIcon, IonNote, CommonModule, RouterLink,
  ],
})
export class HomePage implements OnInit, OnDestroy {
  lastNight?:OvernightSleepData;
  todaySleepiness:StanfordSleepinessData[] = [];
  weekAverageMinutes = 0;
  loaded = false;
  private sub?:Subscription;

  constructor(public sleepService:SleepService) {
    addIcons({ moon, addCircleOutline, cafeOutline, createOutline });
  }

  async ngOnInit() {
    await this.sleepService.ready;
    this.refresh();
    this.loaded = true;
    this.sub = this.sleepService.changes$.subscribe(() => this.refresh());
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  /* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
  get allSleepData() {
    return SleepService.AllSleepData;
  }

  get todayString():string {
    return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  get weekAverageText():string {
    return OvernightSleepData.formatDuration(this.weekAverageMinutes);
  }

  get latestSleepiness():StanfordSleepinessData | undefined {
    return this.todaySleepiness[0];
  }

  private refresh() {
    const today = new Date();
    this.lastNight = this.sleepService.getOvernightForDay(today);
    this.todaySleepiness = this.sleepService.getSleepinessForDay(today);

    // Average over nights that ended in the last 7 days.
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recent = this.sleepService.getOvernight().filter(n => n.sleepEnd.getTime() >= weekAgo);
    this.weekAverageMinutes = recent.length
      ? Math.round(recent.reduce((sum, n) => sum + n.durationMinutes(), 0) / recent.length)
      : 0;
  }
}
