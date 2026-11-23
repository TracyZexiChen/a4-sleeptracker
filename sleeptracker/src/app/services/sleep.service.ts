import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData, OvernightSleepJSON } from '../data/overnight-sleep-data';
import { StanfordSleepinessData, StanfordSleepinessJSON } from '../data/stanford-sleepiness-data';
import { StorageService } from './storage.service';

/* Keys used in Ionic Storage. */
const OVERNIGHT_KEY = 'overnightData';
const SLEEPINESS_KEY = 'sleepinessData';

/*
 * Holds all logged sleep data in memory (the static arrays from the starter
 * code) and mirrors every change to Ionic Storage so it persists.
 *
 * Pages should call `await sleepService.ready` once before reading data,
 * then read with getOvernight()/getSleepiness() and subscribe to changes$
 * to refresh when anything is added, edited, or deleted.
 */
@Injectable({
  providedIn: 'root'
})
export class SleepService {
	public static AllSleepData:SleepData[] = [];
	public static AllOvernightData:OvernightSleepData[] = [];
	public static AllSleepinessData:StanfordSleepinessData[] = [];

	/* Emits after any record is added, updated, or deleted. */
	public changes$ = new Subject<void>();

	/* Resolves once saved data has been loaded from storage. */
	public ready:Promise<void>;

	constructor(private storage:StorageService) {
		this.ready = this.load();
	}

	/* ---------- Reading ---------- */

	/* All overnight logs, newest night first. */
	public getOvernight():OvernightSleepData[] {
		return [...SleepService.AllOvernightData].sort((a, b) => b.sleepEnd.getTime() - a.sleepEnd.getTime());
	}

	/* All sleepiness logs, newest first. */
	public getSleepiness():StanfordSleepinessData[] {
		return [...SleepService.AllSleepinessData].sort((a, b) => b.loggedAt.getTime() - a.loggedAt.getTime());
	}

	/* The night that ended on the given day, if one was logged. */
	public getOvernightForDay(day:Date):OvernightSleepData | undefined {
		const key = SleepData.dayKey(day);
		return SleepService.AllOvernightData.find(d => d.wakeDayKey() === key);
	}

	/* Sleepiness logs from the given day, newest first. */
	public getSleepinessForDay(day:Date):StanfordSleepinessData[] {
		const key = SleepData.dayKey(day);
		return this.getSleepiness().filter(d => SleepData.dayKey(d.loggedAt) === key);
	}

	/* ---------- Writing (each one saves to storage before resolving) ---------- */

	public async addOvernight(data:OvernightSleepData) {
		SleepService.AllOvernightData.push(data);
		await this.saveOvernight();
	}

	public async addSleepiness(data:StanfordSleepinessData) {
		SleepService.AllSleepinessData.push(data);
		await this.saveSleepiness();
	}

	public async updateOvernight(id:string, data:OvernightSleepData) {
		const index = SleepService.AllOvernightData.findIndex(d => d.id === id);
		if (index === -1) return;
		data.id = id; // keep the same id so the entry stays the "same" record
		SleepService.AllOvernightData[index] = data;
		await this.saveOvernight();
	}

	public async updateSleepiness(id:string, data:StanfordSleepinessData) {
		const index = SleepService.AllSleepinessData.findIndex(d => d.id === id);
		if (index === -1) return;
		data.id = id;
		SleepService.AllSleepinessData[index] = data;
		await this.saveSleepiness();
	}

	public async deleteOvernight(id:string) {
		SleepService.AllOvernightData = SleepService.AllOvernightData.filter(d => d.id !== id);
		await this.saveOvernight();
	}

	public async deleteSleepiness(id:string) {
		SleepService.AllSleepinessData = SleepService.AllSleepinessData.filter(d => d.id !== id);
		await this.saveSleepiness();
	}

	/* Kept from the starter code so older calls still work. */
	public logOvernightData(sleepData:OvernightSleepData) {
		return this.addOvernight(sleepData);
	}

	public logSleepinessData(sleepData:StanfordSleepinessData) {
		return this.addSleepiness(sleepData);
	}

	/* ---------- Storage ---------- */

	/*
	 * Load saved data. On the very first launch nothing is saved yet, so we
	 * add sample data (and save it) so the app does not open empty.
	 */
	private async load() {
		const overnight:OvernightSleepJSON[] | null = await this.storage.get(OVERNIGHT_KEY);
		const sleepiness:StanfordSleepinessJSON[] | null = await this.storage.get(SLEEPINESS_KEY);

		if (overnight === null && sleepiness === null) {
			this.addDefaultData();
			await this.saveOvernight();
			await this.saveSleepiness();
			return;
		}

		SleepService.AllOvernightData = (overnight ?? []).map(json => OvernightSleepData.fromJSON(json));
		SleepService.AllSleepinessData = (sleepiness ?? []).map(json => StanfordSleepinessData.fromJSON(json));
		this.rebuildAll();
		this.changes$.next();
	}

	private async saveOvernight() {
		await this.storage.set(OVERNIGHT_KEY, SleepService.AllOvernightData.map(d => d.toJSON()));
		this.rebuildAll();
		this.changes$.next();
	}

	private async saveSleepiness() {
		await this.storage.set(SLEEPINESS_KEY, SleepService.AllSleepinessData.map(d => d.toJSON()));
		this.rebuildAll();
		this.changes$.next();
	}

	/* AllSleepData is the combined list of both kinds, newest first. */
	private rebuildAll() {
		const all:SleepData[] = [...SleepService.AllOvernightData, ...SleepService.AllSleepinessData];
		SleepService.AllSleepData = all.sort((a, b) => SleepService.sortTime(b) - SleepService.sortTime(a));
	}

	private static sortTime(d:SleepData):number {
		return d instanceof OvernightSleepData ? d.sleepEnd.getTime() : d.loggedAt.getTime();
	}

	/* ---------- Sample data ---------- */

	/*
	 * Two weeks of realistic-looking sample data for a college student:
	 * later bedtimes on weekends, a few short nights, and 2-3 sleepiness
	 * check-ins per day. Today's night is left unlogged on purpose so the
	 * Today page shows the "log last night" prompt on first launch.
	 */
	private addDefaultData() {
		const bedtimes = [23.5, 0.25, 23.75, 1.5, 0.5, 23.25, 2.0, 0.75, 23.5, 0.0, 1.25, 23.75, 0.5];
		const hoursSlept = [7.5, 6.25, 7.75, 5.5, 6.75, 8.0, 7.0, 6.5, 7.25, 8.25, 5.75, 7.0, 6.5];
		const qualities = [4, 3, 4, 2, 3, 5, 3, 3, 4, 5, 2, 4, 3];

		for (let daysAgo = 1; daysAgo <= bedtimes.length; daysAgo++) {
			const i = daysAgo - 1;
			// Wake-up morning is `daysAgo` days before today.
			const bed = new Date();
			bed.setDate(bed.getDate() - daysAgo);
			const bedHour = bedtimes[i];
			if (bedHour > 12) {
				bed.setDate(bed.getDate() - 1); // went to bed the evening before
			}
			bed.setHours(Math.floor(bedHour), Math.round((bedHour % 1) * 60), 0, 0);
			const wake = new Date(bed.getTime() + hoursSlept[i] * 60 * 60 * 1000);
			const night = new OvernightSleepData(bed, wake, qualities[i]);
			night.loggedAt = new Date(wake.getTime() + 20 * 60 * 1000);
			SleepService.AllOvernightData.push(night);

			// Sleepiness check-ins for that day.
			const checkIns:[number, number, string][] = [
				[9, 3 + (hoursSlept[i] < 6.5 ? 2 : 0), 'Before coffee'],
				[14, 4 + (hoursSlept[i] < 6.5 ? 1 : 0), 'In class'],
				[22, 5, 'Before bed'],
			];
			for (const [hour, value, context] of checkIns) {
				if (daysAgo % 3 === 0 && hour === 14) continue; // skip a few to look natural
				const at = new Date(wake);
				at.setHours(hour, 10 + (daysAgo * 7) % 40, 0, 0);
				SleepService.AllSleepinessData.push(new StanfordSleepinessData(Math.min(value, 7), at, context));
			}
		}
		this.rebuildAll();
	}
}
