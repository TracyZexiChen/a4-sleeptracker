import { SleepData } from './sleep-data';

/* Plain-object shape used when saving to storage. Dates are ISO strings. */
export interface OvernightSleepJSON {
	id:string;
	loggedAt:string;
	sleepStart:string;
	sleepEnd:string;
	quality?:number;
	notes?:string;
}

export class OvernightSleepData extends SleepData {
	/* Labels for the optional 1-5 sleep quality rating. Index 0 is unused. */
	public static QualityLabels = [undefined, 'Awful', 'Poor', 'Okay', 'Good', 'Great'];

	sleepStart:Date;
	sleepEnd:Date;
	quality?:number; // 1-5, optional
	notes?:string;

	constructor(sleepStart:Date, sleepEnd:Date, quality?:number, notes?:string) {
		super();
		this.sleepStart = sleepStart;
		this.sleepEnd = sleepEnd;
		this.quality = quality;
		this.notes = notes;
	}

	/* Length of the night in whole minutes. */
	durationMinutes():number {
		return Math.round((this.sleepEnd.getTime() - this.sleepStart.getTime()) / (1000 * 60));
	}

	/* Short duration such as "7h 45m". */
	durationString():string {
		return OvernightSleepData.formatDuration(this.durationMinutes());
	}

	override summaryString():string {
		var sleepStart_ms = this.sleepStart.getTime();
		var sleepEnd_ms = this.sleepEnd.getTime();

		// Calculate the difference in milliseconds
		var difference_ms = sleepEnd_ms - sleepStart_ms;

		// Convert to hours and minutes
		return Math.floor(difference_ms / (1000*60*60)) + " hours, " + Math.floor(difference_ms / (1000*60) % 60) + " minutes.";
	}

	override dateString():string {
		return "Night of " + this.sleepStart.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
	}

	/* "11:15 PM – 7:30 AM" */
	rangeString():string {
		const opts:Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };
		return this.sleepStart.toLocaleTimeString('en-US', opts) + ' – ' + this.sleepEnd.toLocaleTimeString('en-US', opts);
	}

	/*
	 * A night "belongs" to the morning the person woke up, since that is when
	 * most people log it. The app allows one night per wake-up day.
	 */
	wakeDayKey():string {
		return SleepData.dayKey(this.sleepEnd);
	}

	qualityLabel():string | undefined {
		return this.quality ? OvernightSleepData.QualityLabels[this.quality] : undefined;
	}

	toJSON():OvernightSleepJSON {
		return {
			id: this.id,
			loggedAt: this.loggedAt.toISOString(),
			sleepStart: this.sleepStart.toISOString(),
			sleepEnd: this.sleepEnd.toISOString(),
			quality: this.quality,
			notes: this.notes,
		};
	}

	/* Rebuild a class instance (with its methods) from a stored plain object. */
	static fromJSON(json:OvernightSleepJSON):OvernightSleepData {
		const data = new OvernightSleepData(new Date(json.sleepStart), new Date(json.sleepEnd), json.quality, json.notes);
		data.id = json.id;
		data.loggedAt = new Date(json.loggedAt);
		return data;
	}

	static formatDuration(minutes:number):string {
		const h = Math.floor(minutes / 60);
		const m = minutes % 60;
		return h + 'h ' + m + 'm';
	}
}
