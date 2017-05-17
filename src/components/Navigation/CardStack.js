import React, { PropTypes } from 'react';
import { View, StyleSheet, Animate } from 'react-native';

import Card from './Card';
import CardStackPanResponder from './CardStackPanResponder';
import CardStackStyleInterpolator from './CardStackStyleInterpolator';
import NavigationPropTypes from './NavigationPropTypes';
import NavigationTransitioner from './NavigationTransitioner';

import type {
	NavigationState,
	NavigationSceneRenderer,
	NavigationSceneRendererProps,
	NavigationTransitionProps,
} from './NavigationTypeDefinition';

import type {
	NavigationGestureDirection,
} from './CardStackPanResponder';

const { Directions } = CardStackPanResponder;
const NativeAnimatedModule = Animate;

type Props = {
	direction: NavigationGestureDirection,
	navigationState: NavigationState,
	onNavigateBack?: Function,
	renderHeader: ?NavigationSceneRenderer,
	renderScene: NavigationSceneRenderer,
	cardStyle?: any,
	style: any,
	gestureResponseDistance?: ?number,
	enableGestures: ?boolean
};

type DefaultProps = {
	direction: NavigationGestureDirection,
	enableGestures: boolean
};

/**
 * A controlled navigation view that renders a stack of cards.
 *
 * ```html
 *     +------------+
 *   +-|   Header   |
 * +-+ |------------|
 * | | |            |
 * | | |  Focused   |
 * | | |   Card     |
 * | | |            |
 * +-+ |            |
 *   +-+            |
 *     +------------+
 * ```
 *
 * ## Example
 *
 * ```js
 *
 * class App extends React.Component {
 *   constructor(props, context) {
 *     this.state = {
 *       navigation: {
 *         index: 0,
 *         routes: [
 *           {key: 'page 1'},
 *         },
 *       },
 *     };
 *   }
 *
 *   render() {
 *     return (
 *       <NavigationCardStack
 *         navigationState={this.state.navigation}
 *         renderScene={this._renderScene}
 *       />
 *     );
 *   }
 *
 *   _renderScene: (props) => {
 *     return (
 *       <View>
 *         <Text>{props.scene.route.key}</Text>
 *       </View>
 *     );
 *   };
 * ```
 */
class NavigationCardStack extends React.Component<DefaultProps, Props, void> {
	_render: NavigationSceneRenderer;
	_renderScene: NavigationSceneRenderer;

	static propTypes = {
		/**
		 * Custom style applied to the card.
		 */
		cardStyle: PropTypes.any,

		/**
		 * Direction of the cards movement. Value could be `horizontal` or
		 * `vertical`. Default value is `horizontal`.
		 */
		direction: PropTypes.oneOf([Directions.HORIZONTAL, Directions.VERTICAL]),

		/**
		 * The distance from the edge of the card which gesture response can start
		 * for. Defaults value is `30`.
		 */
		gestureResponseDistance: PropTypes.number,

		/**
		 * Enable gestures. Default value is true.
		 *
		 * When disabled, transition animations will be handled natively, which
		 * improves performance of the animation. In future iterations, gestures
		 * will also work with native-driven animation.
		 */
		enableGestures: PropTypes.bool,

		/**
		 * The controlled navigation state. Typically, the navigation state
		 * look like this:
		 *
		 * ```js
		 * const navigationState = {
     *   index: 0, // the index of the selected route.
     *   routes: [ // A list of routes.
     *     {key: 'page 1'}, // The 1st route.
     *     {key: 'page 2'}, // The second route.
     *   ],
     * };
		 * ```
		 */
		navigationState: NavigationPropTypes.navigationState.isRequired,

		/**
		 * Callback that is called when the "back" action is performed.
		 * This happens when the back button is pressed or the back gesture is
		 * performed.
		 */
		onNavigateBack: PropTypes.func,

		/**
		 * Function that renders the header.
		 */
		renderHeader: PropTypes.func,

		/**
		 * Function that renders the a scene for a route.
		 */
		renderScene: PropTypes.func.isRequired,

		/**
		 * Custom style applied to the cards stack.
		 */
		style: View.propTypes.style,
	};

	static defaultProps: DefaultProps = {
		direction: Directions.HORIZONTAL,
		enableGestures: true,
	};

	constructor(props: Props, context: any) {
		super(props, context);
	}

	componentWillMount(): void {
		this._render = this._render.bind(this);
		this._renderScene = this._renderScene.bind(this);
	}

	render(): React.Element<any> {
		return (
			<NavigationTransitioner
				configureTransition={this._configureTransition}
				navigationState={this.props.navigationState}
				render={this._render}
				style={this.props.style}
			/>
		);
	}

	_configureTransition = () => {
		const isVertical = this.props.direction === 'vertical';
		const animationConfig = {};
		if (
			!!NativeAnimatedModule

			// Gestures do not work with the current iteration of native animation
			// driving. When gestures are disabled, we can drive natively.
			&& !this.props.enableGestures

			// Native animation support also depends on the transforms used:
			&& CardStackStyleInterpolator.canUseNativeDriver(isVertical)
		) {
			animationConfig.useNativeDriver = true;
		}
		return animationConfig;
	};

	_render(props: NavigationTransitionProps): React.Element<any> {
		const {
			renderHeader,
		} = this.props;

		const header = renderHeader ? <View>{renderHeader(props)}</View> : null;

		const scenes = props.scenes.map(
			scene => this._renderScene({
				...props,
				scene,
			})
		);

		return (
			<View style={styles.container}>
				<View
					style={styles.scenes}>
					{scenes}
				</View>
				{header}
			</View>
		);
	}

	_renderScene(props: NavigationSceneRendererProps): React.Element<any> {
		const isVertical = this.props.direction === 'vertical';

		const style = isVertical ?
			CardStackStyleInterpolator.forVertical(props) :
			CardStackStyleInterpolator.forHorizontal(props);

		let panHandlers = null;

		if (this.props.enableGestures) {
			const panHandlersProps = {
				...props,
				onNavigateBack: this.props.onNavigateBack,
				gestureResponseDistance: this.props.gestureResponseDistance,
			};
			panHandlers = isVertical ?
				CardStackPanResponder.forVertical(panHandlersProps) :
				CardStackPanResponder.forHorizontal(panHandlersProps);
		}

		return (
			<Card
				{...props}
				key={`card_${props.scene.key}`}
				panHandlers={panHandlers}
				renderScene={this.props.renderScene}
				style={[style, this.props.cardStyle]}
			/>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// Header is physically rendered after scenes so that Header won't be
		// covered by the shadows of the scenes.
		// That said, we'd have use `flexDirection: 'column-reverse'` to move
		// Header above the scenes.
		flexDirection: 'column-reverse',
	},
	scenes: {
		flex: 1,
	},
});

export default NavigationCardStack;
