import { I18nManager } from 'react-native';

import type  {
	NavigationSceneRendererProps,
} from './NavigationTypeDefinition';

/**
 * Utility that builds the style for the card in the cards list.
 *
 * +-------------+-------------+-------------+
 * |             |             |             |
 * |             |             |             |
 * |             |             |             |
 * |    Next     |   Focused   |  Previous   |
 * |    Card     |    Card     |    Card     |
 * |             |             |             |
 * |             |             |             |
 * |             |             |             |
 * +-------------+-------------+-------------+
 */

/**
 * Render the initial style when the initial layout isn't measured yet.
 */
function forInitial(props: NavigationSceneRendererProps): Object {
	const {
		navigationState,
		scene,
	} = props;

	const focused = navigationState.index === scene.index;
	const opacity = focused ? 1 : 0;
	// If not focused, move the scene to the far away.
	const dir = scene.index > navigationState.index ? 1 : -1;
	const translate = focused ? 0 : (1000000 * dir);
	return {
		opacity,
		transform: [
			{ translateX: translate },
			{ translateY: translate },
		],
	};
}

function forHorizontal(props: NavigationSceneRendererProps): Object {
	const {
		layout,
		position,
		scene,
	} = props;

	if (!layout.isMeasured) {
		return forInitial(props);
	}

	const index = scene.index;
	const inputRange = [index - 1, index, index + 1];
	const width = layout.initWidth;
	const outputRange = I18nManager.isRTL ?
		([-width, 0, width]: Array<number>) :
		([width, 0, -width]: Array<number>);

	const translateX = position.interpolate({
		inputRange,
		outputRange,
	});

	return {
		opacity: 1,
		shadowColor: 'transparent',
		shadowRadius: 0,
		transform: [
			{ scale: 1 },
			{ translateX },
			{ translateY: 0 },
		],
	};
}

module.exports = {
	forHorizontal,
};
