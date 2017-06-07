import { Animated } from 'react-native';
import type { Style as StyleObj, } from '../../typeDefinition';

export type Route<T: { key: string, testID?: string }> = T;

export type NavigationState<T: { key: string }> = {
	index: number,
	routes: Array<T>,
};

export type Scene<T> = {
	route: T,
	focused: boolean,
	index: number,
};

export type Layout = {
	height: number,
	width: number,
};

export type SceneRendererProps<T> = {
	layout: Layout & {
		measured: boolean,
	},
	navigationState: NavigationState<T>,
	position: Animated.Value,
	jumpToIndex: (index: number) => void,
	getLastPosition: () => number,
	subscribe: (
		event: SubscriptionName,
		callback: Function) => { remove: Function },
};

export type SubscriptionName = 'reset' | 'position';

export type TransitionProps = {
	progress: number,
};

export type TransitionSpec = {
	timing: Function,
};

export type TransitionConfigurator = (
	currentTransitionProps: TransitionProps,
	nextTransitionProps: TransitionProps) => TransitionSpec;

export type PagerProps = {
	configureTransition?: TransitionConfigurator,
	animationEnabled?: boolean,
	swipeEnabled?: boolean,
	swipeDistanceThreshold?: number,
	swipeVelocityThreshold?: number,
	children?: *,
};

export type Style = StyleObj;
