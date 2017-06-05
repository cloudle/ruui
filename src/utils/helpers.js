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