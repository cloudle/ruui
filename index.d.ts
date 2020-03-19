type Component = Function;

export function connect(stateToPropsFactory: Function): Component;

export function ruuiMiddleware(ruuiStore: Object): void;
export function ruuiReducer(state: Object, action: Object): Object;
export function createRuuiStore(): Object;
export function appReducer(reducer: Function): Function;
export function routeReducer(routeOptions: Object, reducer: Function): Function;

export const RuuiProvider: Component;
export const ResponsibleTouchArea: Component;
export const RippleEffect: Component;
export const Button: Component;
export const Input: Component;
export const Modal: Component;
export const Dropdown: Component;
export const DropdownContainer: Component;
export const Select: Component;
export const Snackbar: Component;
export const Tooltip: Component;
export const TooltipContainer: Component;
export const ConnectionMask: Component;
export const Slider: Component;
export const RadioIcon: Component;

export function collectionMutate(collection: Array<Object>, instance: Object, uniqueKey?: String, merge?: Boolean, additionalMerge?: Object): Array<Object>;
export function collectionInsert(collection: Array<Object>, instance: Object, pop?: Boolean): Array<Object>;
export function collectionDestroy(collection: Array<Object>, instance: Object, uniqueKey?: String): Array<Object>;

export const utils: {
	connect(stateToPropsFactory: Function): Function,
	debounce(fn: Function, duration: Number): Function,
	uuid(): String,
	instantInterval(fn: Function, interval: Number, trigger?: Boolean),
	minGuard(value: Number, gap: Number): Number,
	maxGuard(value: Number, gap: Number): Number,
	clamp(value: Number, min: Number, max: Number): Number,
	hasOwn(source: Object, property: String): Boolean,
	shallowEqual(objA: Object, objB: Object): Boolean,
	valueAt(root: Object, path: String, defaultValue: any): any,
	directionSnap(
		top: Number, left: Number, width1: Number, height1: Number,
		width2: Number, height2: Number,
		position: String,
		spacing: Number,
	): Object,
};

export const defaultConfigs: {
	button: Object,
	modal: Object,
};

export function enterAnimation(configs: Object): Component;

