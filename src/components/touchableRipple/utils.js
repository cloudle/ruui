import { useState, useRef, } from 'react';

import { uuid, } from '../../utils';
import { collectionDestroy, } from '../../utils/collection';

export function extractWrapperStyle(baseStyles) {
	return [
		'borderRadius',
		'borderTopLeftRadius',
		'borderTopRightRadius',
		'borderBottomLeftRadius',
		'borderBottomRightRadius',
		'backgroundColor',
	].reduce((accumulate, currentAttribute) => {
		if (baseStyles[currentAttribute]) {
			accumulate[currentAttribute] = baseStyles[currentAttribute];
		}

		return accumulate;
	}, {});
}

export function useRipple(rippleCount = 5, staticRipple, flattenStyle) {
	const [ripples, setRipples] = useState([]);

	const onPressIn = (containerRef, touchEvent) => {
		containerRef.current.measure((x, y, width, height, px, py) => {
			const rippleStyle = extractRippleStyle(touchEvent, staticRipple, x, y, width, height, px, py);

			const newRipple = {
				id: uuid(),
				style: rippleStyle,
			};
			let nextRipples = [newRipple, ...ripples];

			if (nextRipples.length > 5) {
				nextRipples = nextRipples.slice(0, 5);
			}

			setRipples(nextRipples);
		});
	};

	const onAnimationComplete = (id) => {
		setRipples(collectionDestroy(ripples, { id }));
	};

	return [onPressIn, onAnimationComplete, ripples];
}

function extractRippleStyle({ nativeEvent, }, staticRipple, x, y, width, height, px, py) {
	let rippleRadius = 0;
	const { locationX, locationY, offsetX, offsetY, pageX, pageY, } = nativeEvent;
	const touchX = locationX || offsetX;
	const touchY = locationY || offsetY;

	if (staticRipple) {
		rippleRadius = width / 2;
		return {
			width: rippleRadius * 2,
			height: rippleRadius * 2,
			borderRadius: rippleRadius,
			backgroundColor: '#ffffff',
			top: (height / 2) - rippleRadius,
			left: (width / 2) - rippleRadius,
		};
	} else {
		if (touchX > (width / 2)) {
			if (touchY > (height / 2)) { /* <- bottom-right */
				rippleRadius = Math.sqrt((touchX * touchX) + (touchY * touchY));
			} else {  /* <- top-right */
				const paddedY = touchY - height;
				rippleRadius = Math.sqrt((touchX * touchX) + (paddedY * paddedY));
			}
		} else if (touchY > (height / 2)) {  /* <- bottom-left */
			const paddedX = touchY - width;
			rippleRadius = Math.sqrt((paddedX * paddedX) + (touchY * touchY));
		} else {
			const paddedX = touchX - width;
			const paddedY = touchY - height;
			rippleRadius = Math.sqrt((paddedX * paddedX) + (paddedY * paddedY));
		}

		rippleRadius *= 1.2;

		return {
			width: rippleRadius * 2,
			height: rippleRadius * 2,
			borderRadius: rippleRadius,
			backgroundColor: '#ffffff',
			top: touchY - rippleRadius,
			left: touchX - rippleRadius,
		};
	}
}
