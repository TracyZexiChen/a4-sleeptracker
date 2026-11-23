import { nanoid } from 'nanoid';

export class SleepData {
	id:string;
	loggedAt:Date;

	constructor() {
		//Assign a random (unique) ID. This may be useful for comparison (e.g., are two logged entries the same).
		this.id = nanoid();
		this.loggedAt = new Date();
	}

	summaryString():string {
		return 'Unknown sleep data';
	}

	dateString():string {
		return this.loggedAt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
	}

	/* Time of day the entry refers to, e.g. "2:38 PM". */
	timeString():string {
		return this.loggedAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
	}

	/*
	 * Local calendar day as "YYYY-MM-DD". Used to group entries by day and to
	 * check whether a night has already been logged for a given day.
	 */
	static dayKey(date:Date):string {
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		return date.getFullYear() + '-' + month + '-' + day;
	}
}
