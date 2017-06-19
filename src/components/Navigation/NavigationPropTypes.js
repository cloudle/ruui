import React from 'react';
import { Animated } from 'react-native';

import type {
	NavigationSceneRendererProps,
} from './NavigationTypeDefinition';

/**
 * React component PropTypes Definitions. Consider using this as a supplementary
 * measure with `NavigationTypeDefinition`. This helps to capture the propType
 * error at run-time, where as `NavigationTypeDefinition` capture the flow
 * type check errors at build time.
 */

/* NavigationAction */
export type action = {
	type: string,
};

/* NavigationAnimatedValue  */
type animatedValue = Animated.Value;

/* NavigationRoute  */
export type navigationRoute = {
	key: string,
};

/* navigationRoute  */
export type navigationState = {
	index: number,
	routes?: Array<navigationRoute>,
};

/* NavigationLayout */
export type layout = {
	height?: animatedValue,
	initHeight: number,
	initWidth: number,
	isMeasured: boolean,
	width?: animatedValue,
};

/* NavigationScene */
export type scene = {
	index: number,
	isActive: boolean,
	isStale: boolean,
	key: string,
	route: navigationRoute,
};

/* NavigationSceneRendererProps */
export type SceneRendererProps = {
	layout: layout,
	navigationState: navigationState,
	position: animatedValue,
	progress: animatedValue,
	scene: scene,
	scenes: Array<scene>,
};

export type SceneRenderer = {
	layout: layout,
	navigationState: navigationState,
	position: animatedValue,
	progress: animatedValue,
	scene: scene,
	scenes: Array<scene>,
};

/* NavigationPanPanHandlers */
export type panHandlers = {
	onMoveShouldSetResponder: Function,
	onMoveShouldSetResponderCapture: Function,
	onResponderEnd: Function,
	onResponderGrant: Function,
	onResponderMove: Function,
	onResponderReject: Function,
	onResponderRelease: Function,
	onResponderStart: Function,
	onResponderTerminate: Function,
	onResponderTerminationRequest: Function,
	onStartShouldSetResponder: Function,
	onStartShouldSetResponderCapture: Function,
};

/**
 * Helper function that extracts the props needed for scene renderer.
 */
export function extractSceneRendererProps(props: NavigationSceneRendererProps)
: NavigationSceneRendererProps {
	return {
		layout: props.layout,
		navigationState: props.navigationState,
		position: props.position,
		progress: props.progress,
		scene: props.scene,
		scenes: props.scenes,
	};
}

// export default {
// 	// helpers
// 	extractSceneRendererProps,
//
// 	// Bundled propTypes.
// 	SceneRendererProps,
//
// 	// propTypes
// 	SceneRenderer,
// 	action,
// 	navigationState,
// 	navigationRoute,
// 	panHandlers,
// };
