export function debounce(duration, fn) {
	let timeout;
	return function () {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			timeout = null;
			fn.apply(this, arguments);
		}, duration);
	};
}

export function instantInterval (
	func: Function,
	interval: Number,
	trigger: Boolean = true
) {
	if (trigger) this::func();
	return setInterval(func, interval);
}

export function minGuard (value: Number, gap: Number = 0) {
	return value < gap ? gap : value;
}

export function maxGuard (value: Number, gap: Number) {
	return value > gap ? gap : value;
}

export function clamp(value, min, max) {
	return min < max
		? (value < min ? min : value > max ? max : value)
		: (value < max ? max : value > min ? min : value)
}