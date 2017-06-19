/* @flow */

import { Animated } from 'react-native';

export type NavigationRoutePropType = {
	title?: string,
	key: string,
};

export type NavigationStatePropType = {
	routes: Array<NavigationRoutePropType>,
	index: number,
};

export type SceneRendererPropType = {
	layout: {
		measured: boolean,
		height: number,
		width: number,
	},
	navigationState: NavigationStatePropType,
	position: Animated.Value,
	jumpToIndex: Function,
	getLastPosition: Function,
	subscribe: Function,
};
