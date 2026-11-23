/* from the Stanford Sleepiness Scale */
/* https://web.stanford.edu/~dement/sss.html */

import { SleepData } from './sleep-data';

/* Plain-object shape used when saving to storage. Dates are ISO strings. */
export interface StanfordSleepinessJSON {
	id:string;
	loggedAt:string;
	loggedValue:number;
	context?:string;
	notes?:string;
}

export class StanfordSleepinessData extends SleepData {
	public static ScaleValues = [undefined,//Sleepiness scale starts at 1
	'Feeling active, vital, alert, or wide awake', //1
	'Functioning at high levels, but not at peak; able to concentrate', //2
	'Awake, but relaxed; responsive but not fully alert', //3
	'Somewhat foggy, let down', //4
	'Foggy; losing interest in remaining awake; slowed down', //5
	'Sleepy, woozy, fighting sleep; prefer to lie down', //6
	'No longer fighting sleep, sleep onset soon; having dream-like thoughts']; //7

	/* Optional quick tags for what was going on when the person logged. */
	public static ContextOptions = ['Just woke up', 'Before coffee', 'After coffee', 'In class', 'After a nap', 'Before bed'];

	loggedValue:number;
	context?:string;
	notes?:string;

	constructor(loggedValue:number, loggedAt:Date = new Date(), context?:string, notes?:string) {
		super();
		this.loggedValue = loggedValue;
		this.loggedAt = loggedAt;
		this.context = context;
		this.notes = notes;
	}

	override summaryString():string {
		return this.loggedValue + ": " + StanfordSleepinessData.ScaleValues[this.loggedValue];
	}

	/* The scale's description for this entry's rating. */
	description():string {
		return StanfordSleepinessData.ScaleValues[this.loggedValue] ?? '';
	}

	toJSON():StanfordSleepinessJSON {
		return {
			id: this.id,
			loggedAt: this.loggedAt.toISOString(),
			loggedValue: this.loggedValue,
			context: this.context,
			notes: this.notes,
		};
	}

	/* Rebuild a class instance (with its methods) from a stored plain object. */
	static fromJSON(json:StanfordSleepinessJSON):StanfordSleepinessData {
		const data = new StanfordSleepinessData(json.loggedValue, new Date(json.loggedAt), json.context, json.notes);
		data.id = json.id;
		return data;
	}
}
