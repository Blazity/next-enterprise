import * as eases from 'svelte/easing';
import type { EasingFunction } from '@repo/types';

interface EaseType {
	fn: EasingFunction;
	shape: string;
}

interface EaseGroup {
	In?: EaseType;
	Out?: EaseType;
	InOut?: EaseType;
}

interface ProcessedEases {
	[key: string]: EaseGroup | EasingFunction | undefined;
	linear?: EasingFunction;
}

const processedEases: ProcessedEases = {};

for (const ease in eases) {
	if (ease === 'linear') {
		processedEases.linear = eases.linear as EasingFunction;
	} else {
		const name = ease.replace(/In$|InOut$|Out$/, '');
		const typeMatch = ease.match(/In$|InOut$|Out$/);
		const type = typeMatch ? typeMatch[0] : '';

		if (!(name in processedEases)) {
			processedEases[name] = {};
		}

		const easeGroup = processedEases[name] as EaseGroup;
		const easeFn = eases[ease as keyof typeof eases] as EasingFunction;

		let shape = 'M0 1000';
		for (let i = 1; i <= 1000; i++) {
			shape = `${shape} L${(i / 1000) * 1000} ${1000 - easeFn(i / 1000) * 1000} `;
		}

		if (type === 'In' || type === 'Out' || type === 'InOut') {
			easeGroup[type] = {
				fn: easeFn,
				shape
			};
		}
	}
}

export const sortedEases = new Map<string, EaseGroup>([
	['sine', processedEases.sine as EaseGroup],
	['quad', processedEases.quad as EaseGroup],
	['cubic', processedEases.cubic as EaseGroup],
	['quart', processedEases.quart as EaseGroup],
	['quint', processedEases.quint as EaseGroup],
	['expo', processedEases.expo as EaseGroup],
	['circ', processedEases.circ as EaseGroup],
	['back', processedEases.back as EaseGroup],
	['elastic', processedEases.elastic as EaseGroup],
	['bounce', processedEases.bounce as EaseGroup]
]);

export const types: Array<[string, string]> = [
	['Ease In', 'In'],
	['Ease Out', 'Out'],
	['Ease In Out', 'InOut']
];

export { sortedEases as eases };
