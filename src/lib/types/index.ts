export interface ChartDataPoint {
	year: number;
	value: number;
}

export interface ScatterPoint {
	x: number;
	y: number;
}

export type EasingFunction = (t: number) => number;

export interface TransitionConfig {
	delay?: number;
	duration?: number;
	easing?: EasingFunction;
	css?: (t: number, u: number) => string;
	tick?: (t: number, u: number) => void;
}

export interface ActionReturn<T = void> {
	update?: (parameters: T) => void;
	destroy?: () => void;
}

export interface LongpressConfig {
	duration?: number;
}

export interface PannableEvent {
	x: number;
	y: number;
	dx: number;
	dy: number;
}

export interface MapboxContext {
	getMap: () => mapboxgl.Map;
}

export interface StyleConfig {
	[key: string]: string | number;
}

export interface TimerCleanup {
	(): void;
}

export interface Attachment {
	url: string;
	name: string;
	contentType: string;
}

export interface ExtendedMessage {
	id?: string;
	role: string;
	content: string;
	parts?: Array<{ type: string; text?: string; reasoning?: string }>;
	experimental_attachments?: Attachment[];
}
