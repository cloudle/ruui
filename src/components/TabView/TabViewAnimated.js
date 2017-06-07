import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Animated, Platform, View, StyleSheet } from 'react-native';
import { NavigationStatePropType } from './TabViewPropTypes';
import type {
	Scene,
	SceneRendererProps,
	NavigationState,
	Layout,
	Route,
	SubscriptionName,
	PagerProps,
	Style,
} from './TabViewTypeDefinitions';

type DefaultProps<T> = {
	renderPager: (props: SceneRendererProps<T> & PagerProps) => React.Element<any>,
};

type Props<T> = PagerProps & {
	navigationState: NavigationState<T>,
	onRequestChangeTab: (index: number) => void,
	onChangePosition?: (value: number) => void,
	initialLayout?: Layout,
	canJumpToTab?: (route: T) => boolean,
	renderPager: (props: SceneRendererProps<T> & PagerProps) => React.Element<any>,
	renderScene: (props: SceneRendererProps<T> & Scene<T>) => ?React.Element<any>,
	renderHeader?: (props: SceneRendererProps<T>) => ?React.Element<any>,
	renderFooter?: (props: SceneRendererProps<T>) => ?React.Element<any>,
	lazy?: boolean,
	style?: Style,
};

type State = {
	loaded: Array<number>,
	layout: Layout & {
		measured: boolean,
	},
	position: Animated.Value,
};

let TabViewPager;

switch (Platform.OS) {
case 'android':
	TabViewPager = require('./TabViewPagerAndroid').default;
	break;
case 'ios':
	TabViewPager = require('./TabViewPagerScroll').default;
	break;
default:
	TabViewPager = require('./TabViewPagerPan').default;
	break;
}

export default class TabViewAnimated<T: Route<*>>
	extends PureComponent<DefaultProps<T>, Props<T>, State> {
	static propTypes = {
		navigationState: NavigationStatePropType.isRequired,
		onRequestChangeTab: PropTypes.func.isRequired,
		onChangePosition: PropTypes.func,
		initialLayout: PropTypes.shape({
			height: PropTypes.number.isRequired,
			width: PropTypes.number.isRequired,
		}),
		canJumpToTab: PropTypes.func,
		renderPager: PropTypes.func.isRequired,
		renderScene: PropTypes.func.isRequired,
		renderHeader: PropTypes.func,
		renderFooter: PropTypes.func,
		lazy: PropTypes.bool,
	};

	static defaultProps = {
		renderPager: (props: SceneRendererProps<*>) => <TabViewPager {...props} />,
		initialLayout: {
			height: 0,
			width: 0,
		},
	};

	constructor(props: Props<T>) {
		super(props);

		this.state = {
			loaded: [this.props.navigationState.index],
			layout: {
				...this.props.initialLayout,
				measured: false,
			},
			position: new Animated.Value(this.props.navigationState.index),
		};
	}

	state: State;

	componentDidMount() {
		this.mounted = true;
		this.positionListener = this.state.position.addListener(
			this.trackPosition,
		);
	}

	componentWillUnmount() {
		this.mounted = false;
		this.state.position.removeListener(this.positionListener);
	}

	mounted: boolean = false;
	nextIndex: ?number;
	lastPosition: ?number;
	positionListener: string;
	subscriptions: { [key: SubscriptionName]: Array<Function> } = {};

	renderScene = (props: SceneRendererProps<T> & Scene<T>) => {
		const { renderScene, lazy } = this.props;
		const { navigationState } = props;
		const { loaded } = this.state;
		if (lazy) {
			if (loaded.includes(navigationState.routes.indexOf(props.route))) {
				return renderScene(props);
			}
			return null;
		}
		return renderScene(props);
	};

	handleChangePosition = (value: number) => {
		const { onChangePosition, navigationState, lazy } = this.props;
		if (onChangePosition) {
			onChangePosition(value);
		}
		const { loaded } = this.state;
		if (lazy) {
			let next = Math.ceil(value);
			if (next === navigationState.index) {
				next = Math.floor(value);
			}
			if (loaded.includes(next)) {
				return;
			}
			this.setState({
				loaded: [...loaded, next],
			});
		}
	};

	trackPosition = (e: { value: number }) => {
		this.handleChangePosition(e.value);
		this.triggerEvent('position', e.value);
		this.lastPosition = e.value;
		const { onChangePosition } = this.props;
		if (onChangePosition) {
			onChangePosition(e.value);
		}
	};

	getLastPosition = () => {
		if (typeof this.lastPosition === 'number') {
			return this.lastPosition;
		} else {
			return this.props.navigationState.index;
		}
	};

	handleLayout = (e: any) => {
		const { height, width } = e.nativeEvent.layout;

		if (
			this.state.layout.width === width &&
			this.state.layout.height === height
		) {
			return;
		}

		this.setState({
			layout: {
				measured: true,
				height,
				width,
			},
		});
	};

	buildSceneRendererProps = (): SceneRendererProps<*> => {
		return {
			layout: this.state.layout,
			navigationState: this.props.navigationState,
			position: this.state.position,
			jumpToIndex: this.jumpToIndex,
			getLastPosition: this.getLastPosition,
			subscribe: this.addSubscription,
		};
	};

	jumpToIndex = (index: number) => {
		if (!this.mounted) {
			// We are no longer mounted, this is a no-op
			return;
		}

		const { canJumpToTab, navigationState } = this.props;

		if (canJumpToTab && !canJumpToTab(navigationState.routes[index])) {
			this.triggerEvent('reset', navigationState.index);
			return;
		}

		if (index !== navigationState.index) {
			this.props.onRequestChangeTab(index);
		}
	};

	addSubscription = (event: SubscriptionName, callback: Function) => {
		if (!this.subscriptions[event]) {
			this.subscriptions[event] = [];
		}
		this.subscriptions[event].push(callback);
		return {
			remove: () => {
				const index = this.subscriptions[event].indexOf(callback);
				if (index > -1) {
					this.subscriptions[event].splice(index, 1);
				}
			},
		};
	};

	triggerEvent = (event: SubscriptionName, value: any) => {
		if (this.subscriptions[event]) {
			this.subscriptions[event].forEach(fn => fn(value));
		}
	};

	render() {
		const {
			/* eslint-disable no-unused-vars */
			navigationState,
			onRequestChangeTab,
			onChangePosition,
			canJumpToTab,
			lazy,
			initialLayout,
			renderScene,
			/* eslint-enable no-unused-vars */
			renderPager,
			renderHeader,
			renderFooter,
			...rest
		} = this.props;

		const nativeProps = Platform.OS === 'web' ? {} : { loaded: this.state.loaded },
			props = this.buildSceneRendererProps();

		return (
			<View
				onLayout={this.handleLayout} {...nativeProps}
				style={[styles.container, this.props.style]}>

				{renderHeader && renderHeader(props)}
				{renderPager({
					...props,
					...rest,
					children: navigationState.routes.map((route, index) =>
						this.renderScene({
							...props,
							route,
							index,
							focused: index === navigationState.index,
						}),
					),
				})}
				{renderFooter && renderFooter(props)}
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		overflow: 'hidden',
	},
});
