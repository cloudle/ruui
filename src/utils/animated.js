import Animated from 'react-native-reanimated';

const { cond, eq, not, set, block, spring: reSpring, startClock, stopClock, clockRunning, Value, Clock, } = Animated;

const onInit = (clock, sequence) => cond(not(clockRunning(clock)), sequence);

export const animate = ({ fn, clock, state, config, from }) => block([
	onInit(clock, [
		set(state.finished, 0),
		set(state.time, 0),
		set(state.position, from),
		startClock(clock),
	]),
	fn(clock, state, config),
	cond(state.finished, stopClock(clock)),
	state.position,
]);


export const spring = (params) => {
	const { clock, from, to, velocity, config: springConfig, } = {
		clock: new Clock(),
		velocity: new Value(0),
		from: 0,
		...params,
	};

	const state = {
		finished: new Value(0),
		position: new Value(0),
		time: new Value(0),
		velocity: new Value(0),
	};

	const config = {
		toValue: new Value(0),
		damping: 15,
		mass: 1,
		stiffness: 150,
		overshootClamping: false,
		restSpeedThreshold: 0.001,
		restDisplacementThreshold: 0.001,
		...springConfig,
	};

	return block([
		onInit(clock, [
			set(config.toValue, to),
			set(state.velocity, velocity),
		]),
		animate({
			clock,
			fn: reSpring,
			state,
			config,
			from,
		}),
	]);
};
