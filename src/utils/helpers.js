import { Dimensions } from 'react-native';
import type { SnappingDirection } from '../typeDefinition';

export function debounce(fn, duration) {
	let timeout;
	return function () {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			timeout = null;
			fn.apply(this, arguments);
		}, duration);
	};
}

export function uuid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
}

export function instantInterval(
	func: Function,
	interval: Number,
	trigger: Boolean = true,
) {
	if (trigger) func.call(this);
	return setInterval(func, interval);
}

export function minGuard(value: Number, gap: Number = 0) {
	return value < gap ? gap : value;
}

export function maxGuard(value: Number, gap: Number) {
	return value > gap ? gap : value;
}

const defaultIteratee = item => item;

export function maxBy(array, iteratee = defaultIteratee) {
	let result;
	if (array == null) return result;

	let computed;
	for (const value of array) {
		const current = iteratee(value);

		if (current != null && (computed === undefined ? current === current : current > computed)) {
			computed = current;
			result = value;
		}
	}
	return result;
}

export function clamp(value: Number, min: Number, max: Number) {
	return min < max
		? (value < min ? min : value > max ? max : value)
		: (value < max ? max : value > min ? min : value);
}

const hasOwn = Object.prototype.hasOwnProperty;

function is(x, y) {
	if (x === y) {
		return x !== 0 || y !== 0 || 1 / x === 1 / y;
	} else {
		return x !== x && y !== y;
	}
}

export function shallowEqual(objA, objB) {
	if (is(objA, objB)) return true;

	if (typeof objA !== 'object' || objA === null
		|| typeof objB !== 'object' || objB === null) {
		return false;
	}

	const keysA = Object.keys(objA);
	const keysB = Object.keys(objB);

	if (keysA.length !== keysB.length) return false;

	for (let i = 0; i < keysA.length; i += 1) {
		if (!hasOwn.call(objB, keysA[i])
			|| !is(objA[keysA[i]], objB[keysA[i]])) {
			return false;
		}
	}

	return true;
}

export function valueAt(root = {}, path, defaultValue) {
	let currentLevel = root;
	const paths = path.split('.');

	for (let i = 0; i < paths.length; i += 1) {
		if (i === paths.length - 1) {
			return currentLevel[paths[i]] || defaultValue;
		} else {
			currentLevel = currentLevel[paths[i]];
			if (!currentLevel) return defaultValue;
		}
	}

	return defaultValue;
}

function rawDirectionSnap(
	top: number = 0, left: number = 0, width1: number = 0, height1: number = 0,
	width2: number = 0, height2: number = 0,
	position: SnappingDirection = 'bottom',
	spacing = 10,
) {
	switch (position) {
	case 'top':
		return {
			top: top - (spacing + height2),
			left: left + ((width1 / 2) - (width2 / 2)),
		};
	case 'left':
		return {
			top: top + ((height1 / 2) - (height2 / 2)),
			left: left - (spacing + width2),
		};
	case 'bottom':
		return {
			top: top + (spacing + height1),
			left: left + ((width1 / 2) - (width2 / 2)),
		};
	case 'right':
		return {
			top: top + ((height1 / 2) - (height2 / 2)),
			left: left + (spacing + width1),
		};
	case 'top-left':
		return {
			top: top - (spacing + height2),
			left,
		};
	case 'left-top':
		return {
			top,
			left: left - (spacing + width2),
		};
	case 'bottom-left':
		return {
			top: top + (spacing + height1),
			left,
		};
	case 'left-bottom':
		return {
			top: top + (height1 - height2),
			left: left - (spacing + width2),
		};
	case 'bottom-right':
		return {
			top: top + (spacing + height1),
			left: left - (width2 - width1),
		};
	case 'right-bottom':
		return {
			top: top + (height1 - height2),
			left: left + (spacing + width1),
		};
	case 'top-right':
		return {
			top: top - (spacing + height2),
			left: left - (width2 - width1),
		};
	case 'right-top':
		return {
			top,
			left: left + (spacing + width1),
		};
	case 'center':
		return {
			top: top + ((height1 / 2) - (height2 / 2)),
			left: left + ((width1 / 2) - (width2 / 2)),
		};
	default:
		return { top: 0, left: 0 };
	}
}

/* <- to make sure floating component's position won't exceed screen's visible area */
function screenGuard(position, componentSize, screenPadding = 5, moddedScreenSize = {}) {
	const screenSize = { ...Dimensions.get('window'), ...moddedScreenSize },
		{ top, left, } = position;
	let guardedTop = top, guardedLeft = left;

	if (top < 5) {
		guardedTop = 5;
	} else if (top + componentSize.height > screenSize.height - screenPadding) {
		guardedTop = screenSize.height - componentSize.height - screenPadding;
	}

	if (left < 5) {
		guardedLeft = 5;
	} else if (left + componentSize.width > screenSize.width - screenPadding) {
		guardedLeft = screenSize.width - componentSize.width - screenPadding;
	}

	return { top: guardedTop, left: guardedLeft, };
}

export function directionSnap(
	top: number = 0, left: number = 0, width1: number = 0, height1: number = 0,
	width2: number = 0, height2: number = 0,
	position: SnappingDirection = 'bottom',
	spacing = 10,
	screenSize,
) {
	return screenGuard(
		rawDirectionSnap(top, left, width1, height1, width2, height2, position, spacing),
		{ width: width2, height: height2, }, 5, screenSize
	);
}

export function arrowSnap(width, height, arrowSize, parentPosition: SnappingDirection, padding = 15) {
	switch (parentPosition) {
	case 'top':
		return {
			bottom: 1 - (arrowSize * 1.5),
			left: (width / 2) - arrowSize,
			transform: [{ rotate: '90deg' }],
		};
	case 'left':
		return {
			right: -arrowSize,
			top: (height / 2) - arrowSize,
		};
	case 'bottom':
		return {
			top: 1 - (arrowSize * 1.5),
			left: (width / 2) - arrowSize,
			transform: [{ rotate: '-90deg' }],
		};
	case 'right':
		return {
			left: -arrowSize,
			top: (height / 2) - arrowSize,
			transform: [{ rotate: '180deg' }],
		};
	case 'top-left':
		return {
			bottom: 1 - (arrowSize * 1.5),
			left: padding,
			transform: [{ rotate: '90deg' }],
		};
	case 'left-top':
		return {
			right: -arrowSize,
			top: padding,
		};
	case 'bottom-left':
		return {
			top: 1 - (arrowSize * 1.5),
			left: padding,
			transform: [{ rotate: '-90deg' }],
		};
	case 'left-bottom':
		return {
			right: -arrowSize,
			bottom: padding,
		};
	case 'bottom-right':
		return {
			top: 1 - (arrowSize * 1.5),
			right: padding,
			transform: [{ rotate: '-90deg' }],
		};
	case 'right-bottom':
		return {
			left: -arrowSize,
			bottom: padding,
			transform: [{ rotate: '180deg' }],
		};
	case 'top-right':
		return {
			bottom: 1 - (arrowSize * 1.5),
			right: padding,
			transform: [{ rotate: '90deg' }],
		};
	case 'center':
		return {
			right: -arrowSize,
			top: (height / 2) - arrowSize,
			opacity: 0,
		};
	case 'right-top':
		return {
			left: -arrowSize,
			top: padding,
			transform: [{ rotate: '180deg' }],
		};
	default:
		return {};
	}
}

export function directionAnimatedConfigs(
	direction, translateDistance, animation, finalBorderRadius = 3
) {
	const borderRadius = animation.interpolate({
			inputRange: [0, 0.5, 1], outputRange: [50, 15, finalBorderRadius],
		}),
		opacity = animation.interpolate({
			inputRange: [0, 1], outputRange: [0, 1],
			extrapolate: 'clamp',
		});

	switch (direction) {
	case 'top':
		return {
			borderRadius: {
				borderBottomLeftRadius: borderRadius,
				borderBottomRightRadius: borderRadius,
			},
			transform: [{
				translateY: animation.interpolate({
					inputRange: [0, 1], outputRange: [translateDistance, 0],
				}),
			}],
			opacity,
		};
	case 'left':
		return {
			borderRadius: {
				borderTopRightRadius: borderRadius,
				borderBottomRightRadius: borderRadius,
			},
			transform: [{
				translateX: animation.interpolate({
					inputRange: [0, 1], outputRange: [translateDistance, 0],
				}),
			}],
			opacity,
		};
	case 'bottom':
		return {
			borderRadius: {
				borderTopLeftRadius: borderRadius,
				borderTopRightRadius: borderRadius,
			},
			transform: [{
				translateY: animation.interpolate({
					inputRange: [0, 1], outputRange: [-translateDistance, 0],
				}),
			}],
			opacity,
		};
	case 'right':
		return {
			borderRadius: {
				borderTopLeftRadius: borderRadius,
				borderBottomLeftRadius: borderRadius,
			},
			transform: [{
				translateX: animation.interpolate({
					inputRange: [0, 1], outputRange: [-translateDistance, 0],
				}),
			}],
			opacity,
		};
	case 'top-left':
		return {
			borderRadius: {
				borderBottomLeftRadius: borderRadius,
			},
			transform: [{
				translateY: animation.interpolate({
					inputRange: [0, 1], outputRange: [translateDistance, 0],
				}),
			}],
			opacity,
		};
	case 'left-top':
		return {
			borderRadius: {
				borderTopRightRadius: borderRadius,
			},
			transform: [{
				translateX: animation.interpolate({
					inputRange: [0, 1], outputRange: [translateDistance, 0],
				}),
			}],
			opacity,
		};
	case 'bottom-left':
		return {
			borderRadius: {
				borderTopLeftRadius: borderRadius,
			},
			transform: [{
				translateY: animation.interpolate({
					inputRange: [0, 1], outputRange: [-translateDistance, 0],
				}),
			}],
			opacity,
		};
	case 'left-bottom':
		return {
			borderRadius: {
				borderBottomRightRadius: borderRadius,
			},
			transform: [{
				translateX: animation.interpolate({
					inputRange: [0, 1], outputRange: [translateDistance, 0],
				}),
			}],
			opacity,
		};
	case 'bottom-right':
		return {
			borderRadius: {
				borderTopRightRadius: borderRadius,
			},
			transform: [{
				translateY: animation.interpolate({
					inputRange: [0, 1], outputRange: [-translateDistance, 0],
				}),
			}],
			opacity,
		};
	case 'right-bottom':
		return {
			borderRadius: {
				borderBottomLeftRadius: borderRadius,
			},
			transform: [{
				translateX: animation.interpolate({
					inputRange: [0, 1], outputRange: [-translateDistance, 0],
				}),
			}],
			opacity,
		};
	case 'top-right':
		return {
			borderRadius: {
				borderBottomRightRadius: borderRadius,
			},
			transform: [{
				translateY: animation.interpolate({
					inputRange: [0, 1], outputRange: [translateDistance, 0],
				}),
			}],
			opacity,
		};
	case 'right-top':
		return {
			borderRadius: {
				borderTopLeftRadius: borderRadius,
			},
			transform: [{
				translateX: animation.interpolate({
					inputRange: [0, 1], outputRange: [-translateDistance, 0],
				}),
			}],
			opacity,
		};
	case 'center':
		return {
			borderRadius: { borderRadius, },
			transform: [],
			opacity,
		};
	default:
		return {
			borderRadius: {
				borderTopLeftRadius: borderRadius,
				borderTopRightRadius: borderRadius,
			},
			transform: [{
				translateY: animation.interpolate({
					inputRange: [0, 1], outputRange: [-translateDistance, 0],
				}),
			}],
			opacity,
		};
	}
}
