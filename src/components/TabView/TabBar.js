import React, { PureComponent } from 'react';
import {
	Animated,
	StyleSheet,
	View,
	Text,
	ScrollView,
	Platform,
	I18nManager,
} from 'react-native';
import TouchableItem from './TouchableItem';
import { SceneRendererPropType } from './TabViewPropTypes';
import { isAndroid } from '../../utils';
import type {
	Scene,
	SceneRendererProps,
	Route,
	Style,
} from './TabViewTypeDefinitions';

type IndicatorProps<T> = SceneRendererProps<T> & {
	width: Animated.Value,
};

type ScrollEvent = {
	nativeEvent: {
		contentOffset: {
			x: number,
		},
	},
};

type DefaultProps<T> = {
	getLabelText: (scene: Scene<T>) => ?string,
};

type Props<T> = SceneRendererProps<T> & {
	scrollEnabled?: boolean,
	pressColor?: string,
	pressOpacity?: number,
	getLabelText: (scene: Scene<T>) => ?string,
	renderLabel?: (scene: Scene<T>) => ?React.Element<any>,
	renderIcon?: (scene: Scene<T>) => ?React.Element<any>,
	renderBadge?: (scene: Scene<T>) => ?React.Element<any>,
	renderIndicator?: (props: IndicatorProps<T>) => ?React.Element<any>,
	onTabPress?: (scene: Scene<T>) => void,
	tabStyle?: Style,
	indicatorStyle?: Style,
	labelStyle?: Style,
	style?: Style,
};

type State = {
	offset: Animated.Value,
	visibility: Animated.Value,
	initialOffset: { x: number, y: number },
};

export default class TabBar<T: Route<*>>
	extends PureComponent<DefaultProps<T>, Props<T>, State> {
	props: Props;

	static defaultProps = {
		getLabelText: ({ route }) => (route.title ? route.title.toUpperCase() : null),
	};

	constructor(props: Props<T>) {
		super(props);

		let initialVisibility = 0;

		if (this.props.scrollEnabled === true) {
			const tabWidth = this.getTabWidthFromStyle(this.props.tabStyle);
			if (this.props.layout.width || tabWidth) {
				initialVisibility = 1;
			}
		} else {
			initialVisibility = 1;
		}

		this.state = {
			offset: new Animated.Value(0),
			visibility: new Animated.Value(initialVisibility),
			initialOffset: {
				x: this.getScrollAmount(this.props, this.props.navigationState.index),
				y: 0,
			},
		};
	}

	state: State;

	componentDidMount() {
		this.adjustScroll(this.props.navigationState.index);
		this.positionListener = this.props.subscribe(
			'position',
			this.adjustScroll,
		);
	}

	componentWillReceiveProps(nextProps: Props<T>) {
		if (this.props.navigationState !== nextProps.navigationState) {
			this.resetScrollOffset(nextProps);
		}

		const nextTabWidth = this.getTabWidthFromStyle(nextProps.tabStyle);

		if (
			(this.props.tabStyle !== nextProps.tabStyle && nextTabWidth) ||
			(this.props.layout.width !== nextProps.layout.width &&
			nextProps.layout.width)
		) {
			this.state.visibility.setValue(1);
		}
	}

	componentDidUpdate(prevProps: Props<T>) {
		if (
			this.props.scrollEnabled &&
			(prevProps.layout !== this.props.layout ||
			prevProps.tabStyle !== this.props.tabStyle)
		) {
			global.requestAnimationFrame(() =>
				this.adjustScroll(this.props.navigationState.index),
			);
		}
	}

	componentWillUnmount() {
		this.positionListener.remove();
	}

	positionListener: Object;
	scrollView: Object;
	isManualScroll: boolean = false;
	isMomentumScroll: boolean = false;

	renderLabel = (scene: Scene<*>) => {
		if (typeof this.props.renderLabel !== 'undefined') {
			return this.props.renderLabel(scene);
		}
		const label = this.props.getLabelText(scene);
		if (typeof label !== 'string') {
			return null;
		}
		return (
			<Text style={[styles.tabLabel, this.props.labelStyle]}>{label}</Text>
		);
	};

	renderIndicator = (props: IndicatorProps<T>) => {
		if (typeof this.props.renderIndicator !== 'undefined') {
			return this.props.renderIndicator(props);
		}
		const { width, position } = props;
		const translateX = Animated.multiply(
			Animated.multiply(position, width),
			I18nManager.isRTL ? -1 : 1,
		);
		return (
			<Animated.View
				style={[
					styles.indicator,
					{ width, transform: [{ translateX }] },
					this.props.indicatorStyle,
				]}
			/>
		);
	};

	tabWidthCache: ?{ style: any, width: ?number };

	getTabWidthFromStyle = (style: any) => {
		if (this.tabWidthCache && this.tabWidthCache.style === style) {
			return this.tabWidthCache.width;
		}
		const passedTabStyle = StyleSheet.flatten(this.props.tabStyle);
		const cache = {
			style,
			width: passedTabStyle ? passedTabStyle.width : null,
		};
		this.tabWidthCache = cache;
		return cache;
	};

	getFinalTabWidth = (props: Props<T>) => {
		const { layout, navigationState } = props;
		const tabWidth = this.getTabWidthFromStyle(props.tabStyle);
		if (typeof tabWidth === 'number') {
			return tabWidth;
		}
		if (typeof tabWidth === 'string' && tabWidth.endsWith('%')) {
			return layout.width * (parseFloat(tabWidth, 10) / 100);
		}
		if (props.scrollEnabled) {
			return (layout.width / 5) * 2;
		}
		return layout.width / navigationState.routes.length;
	};

	getMaxScrollableDistance = (props: Props<T>) => {
		const { layout, navigationState } = props;
		if (layout.width === 0) {
			return 0;
		}
		const finalTabWidth = this.getFinalTabWidth(props);
		const tabBarWidth = finalTabWidth * navigationState.routes.length;
		const maxDistance = tabBarWidth - layout.width;
		return Math.max(maxDistance, 0);
	};

	normalizeScrollValue = (props: Props<T>, value: number) => {
		const maxDistance = this.getMaxScrollableDistance(props);
		return Math.max(Math.min(value, maxDistance), 0);
	};

	getScrollAmount = (props: Props<T>, i: number) => {
		const { layout } = props;
		const finalTabWidth = this.getFinalTabWidth(props);
		const centerDistance = (finalTabWidth * i) + (finalTabWidth / 2);
		const scrollAmount = centerDistance - (layout.width / 2);
		return this.normalizeScrollValue(props, scrollAmount);
	};

	resetScrollOffset = (props: Props<T>) => {
		if (!props.scrollEnabled || !this.scrollView) {
			return;
		}

		const scrollAmount = this.getScrollAmount(
			props,
			props.navigationState.index,
		);
		this.scrollView.scrollTo({
			x: scrollAmount,
			animated: true,
		});
		Animated.timing(this.state.offset, {
			toValue: 0,
			duration: 150,
		}).start();
	};

	adjustScroll = (index: number) => {
		if (!this.props.scrollEnabled || !this.scrollView) {
			return;
		}

		const scrollAmount = this.getScrollAmount(this.props, index);
		this.scrollView.scrollTo({
			x: scrollAmount,
			animated: false,
		});
	};

	adjustOffset = (value: number) => {
		if (!this.isManualScroll || !this.props.scrollEnabled) {
			return;
		}

		const scrollAmount = this.getScrollAmount(
			this.props,
			this.props.navigationState.index,
		);
		const scrollOffset = value - scrollAmount;

		if (this.isMomentumScroll) {
			Animated.spring(this.state.offset, {
				toValue: -scrollOffset,
				tension: 300,
				friction: 35,
			}).start();
		} else {
			this.state.offset.setValue(-scrollOffset);
		}
	};

	handleScroll = (e: ScrollEvent) => {
		this.adjustOffset(e.nativeEvent.contentOffset.x);
	};

	handleBeginDrag = () => {
		// onScrollBeginDrag fires when user touches the ScrollView
		this.isManualScroll = true;
		this.isMomentumScroll = false;
	};

	handleEndDrag = () => {
		// onScrollEndDrag fires when user lifts his finger
		// onMomentumScrollBegin fires after touch end
		// run the logic in next frame so we get onMomentumScrollBegin first
		global.requestAnimationFrame(() => {
			if (this.isMomentumScroll) {
				return;
			}
			this.isManualScroll = false;
		});
	};

	handleMomentumScrollBegin = () => {
		// onMomentumScrollBegin fires on flick, as well as programmatic scroll
		this.isMomentumScroll = true;
	};

	handleMomentumScrollEnd = () => {
		// onMomentumScrollEnd fires when the scroll finishes
		this.isMomentumScroll = false;
		this.isManualScroll = false;
	};

	setRef = (el: Object) => (this.scrollView = el);

	render() {
		const { position, navigationState, scrollEnabled } = this.props;
		const { routes, index } = navigationState;
		const maxDistance = this.getMaxScrollableDistance(this.props);
		const finalTabWidth = this.getFinalTabWidth(this.props);
		const tabBarWidth = finalTabWidth * routes.length;

		// Prepend '-1', so there are always at least 2 items in inputRange
		const inputRange = [-1, ...routes.map((x, i) => i)];
		const translateOutputRange = inputRange.map(
			i => this.getScrollAmount(this.props, i) * -1,
		);

		const translateX = Animated.add(
			position.interpolate({
				inputRange,
				outputRange: translateOutputRange,
			}),
			this.state.offset,
		).interpolate({
			inputRange: [-maxDistance, 0],
			outputRange: [-maxDistance, 0],
			extrapolate: 'clamp',
		});

		const nativeScrollProps = Platform.OS === 'web' ? {} : {
			bounces: false,
			alwaysBounceHorizontal: false,
			scrollsToTop: false,
			automaticallyAdjustContentInsets: false,
			contentOffset: this.state.initialOffset,
			overScrollMode: 'never',
		};

		const platformStyles = isAndroid ? {
			elevation: 4,
		} : {};

		return (
			<Animated.View style={[styles.tabBar, platformStyles, this.props.style]}>
				<Animated.View
					pointerEvents="none"
					style={[
						styles.indicatorContainer,
						scrollEnabled
							? { width: tabBarWidth, transform: [{ translateX }] }
							: null,
					]}>
					{this.renderIndicator({
						...this.props,
						width: new Animated.Value(finalTabWidth),
					})}
				</Animated.View>
				<View style={styles.scroll}>
					<ScrollView
						horizontal
						scrollEnabled={scrollEnabled}
						{...nativeScrollProps}
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={[
							styles.tabContent,
							scrollEnabled ? null : styles.container,
						]}
						scrollEventThrottle={16}
						onScroll={this.handleScroll}
						onScrollBeginDrag={this.handleBeginDrag}
						onScrollEndDrag={this.handleEndDrag}
						onMomentumScrollBegin={this.handleMomentumScrollBegin}
						onMomentumScrollEnd={this.handleMomentumScrollEnd}
						ref={this.setRef}
					>
						{routes.map((route, i) => {
							const focused = index === i;
							const outputRange = inputRange.map(
								inputIndex => (inputIndex === i ? 1 : 0.7),
							);
							const opacity = Animated.multiply(
								this.state.visibility,
								position.interpolate({
									inputRange,
									outputRange,
								}),
							);
							const scene = {
								route,
								focused,
								index: i,
							};
							const label = this.renderLabel(scene);
							const icon = this.props.renderIcon
								? this.props.renderIcon(scene)
								: null;
							const badge = this.props.renderBadge
								? this.props.renderBadge(scene)
								: null;

							const tabStyle = {};

							tabStyle.opacity = opacity;

							if (icon) {
								if (label) {
									tabStyle.paddingTop = 8;
								} else {
									tabStyle.padding = 12;
								}
							}

							const passedTabStyle = StyleSheet.flatten(this.props.tabStyle);
							const isWidthSet =
								(passedTabStyle &&
								typeof passedTabStyle.width !== 'undefined') ||
								scrollEnabled === true;
							const tabContainerStyle = {};

							if (isWidthSet) {
								tabStyle.width = finalTabWidth;
							}

							if (passedTabStyle && typeof passedTabStyle.flex === 'number') {
								tabContainerStyle.flex = passedTabStyle.flex;
							} else if (!isWidthSet) {
								tabContainerStyle.flex = 1;
							}

							const accessibilityLabel =
								route.accessibilityLabel || route.title;

							return (
								<TouchableItem
									borderless
									key={route.key}
									testID={route.testID}
									accessible={route.accessible}
									accessibilityLabel={accessibilityLabel}
									accessibilityTraits="button"
									pressColor={this.props.pressColor}
									pressOpacity={this.props.pressOpacity}
									delayPressIn={0}
									onPress={() => {
										// eslint-disable-line react/jsx-no-bind
										const { onTabPress, jumpToIndex } = this.props;
										jumpToIndex(i);
										if (onTabPress) {
											onTabPress(scene);
										}
									}}
									style={tabContainerStyle}
								>
									<View style={styles.container}>
										<Animated.View
											style={[
												styles.tabItem,
												tabStyle,
												passedTabStyle,
												styles.container,
											]}
										>
											{icon}
											{label}
										</Animated.View>
										{badge
											? <Animated.View
												style={[
													styles.badge,
													{ opacity: this.state.visibility },
												]}
											>
												{badge}
											</Animated.View>
											: null}
									</View>
								</TouchableItem>
							);
						})}
					</ScrollView>
				</View>
			</Animated.View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scroll: {
		overflow: Platform.OS === 'web' ? 'auto' : 'scroll',
	},
	tabBar: {
		backgroundColor: '#2196f3',
		shadowColor: 'black',
		shadowOpacity: 0.1,
		shadowRadius: StyleSheet.hairlineWidth,
		shadowOffset: {
			height: StyleSheet.hairlineWidth,
		},
		// We don't need zIndex on Android, disable it since it's buggy
		zIndex: Platform.OS === 'android' ? 0 : 1,
	},
	tabContent: {
		flexDirection: 'row',
		flexWrap: 'nowrap',
	},
	tabLabel: {
		backgroundColor: 'transparent',
		color: 'white',
		margin: 8,
	},
	tabItem: {
		flexGrow: 1,
		padding: 8,
		alignItems: 'center',
		justifyContent: 'center',
	},
	badge: {
		position: 'absolute',
		top: 0,
		right: 0,
	},
	indicatorContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
	indicator: {
		backgroundColor: '#ffeb3b',
		position: 'absolute',
		left: 0,
		bottom: 0,
		right: 0,
		height: 2,
	},
});
