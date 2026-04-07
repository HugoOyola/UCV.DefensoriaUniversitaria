import {animate, style, transition, trigger} from '@angular/animations';

export const animations = trigger('animations', [
	transition('void => *', [
		style({
			opacity: 0,
			transform: 'translate(-320px,0)',
		}),
		animate(
			'0.0s ease-in-out',
			style({
				opacity: 1,
			})
		),

		animate(
			'0.5s ease-out',

			style({
				transform: 'translate(0px,0)',
			})
		),
	]),
	transition('* => void', [
		style({
			opacity: 1,
		}),
		animate(
			'0.0s ease-in-out',
			style({
				opacity: 1,
			})
		),

		animate(
			'0.5s ease-out',

			style({
				transform: 'translate(-320px,0)',
			})
		),
	]),
]);
