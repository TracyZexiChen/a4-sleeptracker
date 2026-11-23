import { Routes } from '@angular/router';

/*
 * The whole app lives inside a bottom tab bar (TabsPage).
 * Each tab is a child route so the tab bar stays visible while switching.
 */
export const routes: Routes = [
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'home',
        loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
      },
      {
        path: 'log-sleep',
        loadComponent: () => import('./log-sleep/log-sleep.page').then((m) => m.LogSleepPage),
      },
      {
        path: 'log-sleepiness',
        loadComponent: () => import('./log-sleepiness/log-sleepiness.page').then((m) => m.LogSleepinessPage),
      },
      {
        path: 'history',
        loadComponent: () => import('./history/history.page').then((m) => m.HistoryPage),
      },
      {
        path: 'reminders',
        loadComponent: () => import('./notifications/reminder-settings.page').then((m) => m.ReminderSettingsPage),
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: 'tabs/home',
    pathMatch: 'full',
  },
];
