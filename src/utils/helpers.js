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
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		const r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
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

	if (typeof objA !== 'object' || objA === null ||
		typeof objB !== 'object' || objB === null) {
		return false;
	}

	const keysA = Object.keys(objA);
	const keysB = Object.keys(objB);

	if (keysA.length !== keysB.length) return false;

	for (let i = 0; i < keysA.length; i++) {
		if (!hasOwn.call(objB, keysA[i]) ||
			!is(objA[keysA[i]], objB[keysA[i]])) {
			return false;
		}
	}

	return true;
}

export function directionSnap(
	top: number = 0, left: number = 0, width1: number = 0, height1: number = 0,
	width2: number = 0, height2: number = 0,
	position: SnappingDirection = 'bottom',
	spacing = 10) {
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
	default:
		return { top: 0, left: 0 };
	}
}