import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonNote,
  IonTitle,
  IonToolbar,
  ModalController,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { createOutline, notificationsOutline, trashOutline } from 'ionicons/icons';
import { Subscription } from 'rxjs';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { SleepService } from '../services/sleep.service';
import {
  EditedHistoryRecord,
  HistoryEditModalComponent,
  HistoryRecordKind,
} from './history-edit-modal.component';
import { HistoryViewModel } from './history.models';
import { buildHistoryViewModel, formatDuration } from './history.utils';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonList,
    IonNote,
    IonTitle,
    IonToolbar,
  ]
})
export class HistoryPage implements OnInit, OnDestroy {
  viewModel: HistoryViewModel = buildHistoryViewModel([], []);
  private changesSubscription?: Subscription;

  constructor(
    private readonly sleepService: SleepService,
    private readonly modalCtrl: ModalController,
    private readonly toastCtrl: ToastController,
  ) {
    addIcons({ createOutline, notificationsOutline, trashOutline });
  }

  async ngOnInit() {
    await this.sleepService.ready;
    this.refresh();
    this.changesSubscription = this.sleepService.changes$.subscribe(() => this.refresh());
  }

  ionViewWillEnter() {
    this.refresh();
  }

  ngOnDestroy() {
    this.changesSubscription?.unsubscribe();
  }

  formatMinutes(minutes: number | null): string {
    return formatDuration(minutes);
  }

  async edit(
    kind: HistoryRecordKind,
    record: OvernightSleepData | StanfordSleepinessData,
    slidingItem: IonItemSliding,
  ): Promise<void> {
    await slidingItem.close();
    const modal = await this.modalCtrl.create({
      component: HistoryEditModalComponent,
      componentProps: { kind, record },
      breakpoints: [0, 0.92, 1],
      initialBreakpoint: 0.92,
      handle: true,
    });
    await modal.present();
    const result = await modal.onWillDismiss<EditedHistoryRecord>();
    if (result.role !== 'save' || !result.data) return;

    if (result.data.kind === 'overnight') {
      await this.sleepService.updateOvernight(record.id, result.data.data as OvernightSleepData);
    } else {
      await this.sleepService.updateSleepiness(record.id, result.data.data as StanfordSleepinessData);
    }

    await this.showConfirmation('Changes saved');
  }

  async remove(
    kind: HistoryRecordKind,
    record: OvernightSleepData | StanfordSleepinessData,
    slidingItem: IonItemSliding,
  ): Promise<void> {
    await slidingItem.close();
    if (kind === 'overnight') {
      await this.sleepService.deleteOvernight(record.id);
    } else {
      await this.sleepService.deleteSleepiness(record.id);
    }

    const toast = await this.toastCtrl.create({
      message: kind === 'overnight' ? 'Sleep record deleted' : 'Check-in deleted',
      duration: 5000,
      position: 'bottom',
      buttons: [{
        text: 'Undo',
        role: 'cancel',
        handler: () => { void this.restore(kind, record); },
      }],
    });
    await toast.present();
  }

  private refresh() {
    this.viewModel = buildHistoryViewModel(
      this.sleepService.getOvernight(),
      this.sleepService.getSleepiness(),
    );
  }

  private async restore(kind: HistoryRecordKind, record: OvernightSleepData | StanfordSleepinessData): Promise<void> {
    if (kind === 'overnight') {
      await this.sleepService.addOvernight(record as OvernightSleepData);
    } else {
      await this.sleepService.addSleepiness(record as StanfordSleepinessData);
    }
  }

  private async showConfirmation(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({ message, duration: 1800, position: 'top', color: 'success' });
    await toast.present();
  }
}
