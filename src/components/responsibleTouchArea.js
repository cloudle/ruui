import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tinyColor from 'tinycolor2';
import { Animated, Easing, TouchableOpacity, View, StyleSheet, Platform } from 'react-native';

import RippleEffect from './rippleEffect';
import Tooltip from './tooltip';
import { debounce, isIos, isWeb } from '../utils';
import * as appActions from '../store/action/app';
import type { Style, Element, SnappingDirection, AccessibilityComponentType, AccessibilityTrait, Corners, } from '../typeDefinition';

type Props = {
	id?: string,
	nativeID?: string,
	testID?: string,
	accessible?: boolean,
	accessibilityLabel?: any,
	accessibilityComponentType?: AccessibilityComponentType,
	accessibilityTraits?: AccessibilityTrait,
	onAccessibilityTap?: Function,
	onMagicTap?: Function,
	wrapperStyle?: Style,
	innerStyle?: Style,
	tooltip?: String | Element,
	tooltipWrapperStyle?: Style,
	tooltipDirection?: SnappingDirection,
	tooltipPositionSpacing?: number,
	tooltipPositionOffset?: Object,
	ripple?: boolean,
	staticRipple?: boolean,
	rippleColor?: string,
	rippleInitialOpacity?: number,
	rippleInitialScale?: number,
	rippleAnimationSpeed?: number,
	fade?: boolean,
	raise?: boolean,
	debounce?: number,
	disabled?: boolean,
	minActiveOpacity?: number,
	onPress?: Function,
	onPressIn?: Function,
	onPressOut?: Function,
	onLongPress?: Function,
	delayPressIn?: number,
	delayPressOut?: number,
	delayLongPress?: number,
	hitSlop?: Corners,
	pressRetentionOffset?: Corners,
	onLayout?: Function,
	onMouseEnter?: Function,
	onMouseLeave?: Function,
	fadeLevel?: number,
	children?: Element,
};

const MAX_PARTICLE_COUNT = 5;

export default class RuuiResponsibleTouchArea extends Component<any, Props, any> {
	static props: Props;

	static contextTypes = {
		ruuiStore: PropTypes.object,
	};

	static defaultProps = {
		staticRipple: false,
		minActiveOpacity: 0.8,
		ripple: true,
		raise: false,
		fade: false,
		fadeLevel: 0.1,
		disabled: false,
	};

	rippleIndex = 0;

	componentWillUnmount() {
		this.willUnmount = true;
	}

	constructor(props) {
		super(props);
		this.state = {
			ripples: [],
			mouseInside: false,
			layout: { width: 0, height: 0 },
		};

		this.raiseAnimation = new Animated.Value(0);
		this.fadeAnimation = new Animated.Value(0);

		if (this.props.debounce) {
			this.handlePress = debounce(this.handlePress.bind(this), this.props.debounce);
		}
	}

	render() {
		const nativeProps = isWeb ? {} : {
				nativeID: this.props.nativeID,
				testID: this.props.testID,
			},
			flattenWrapperStyles = StyleSheet.flatten(this.props.wrapperStyle) || {},
			platformStyles = Platform.select({
				web: { cursor: 'pointer', userSelect: 'none' },
			}),
			isLightBackground = tinyColor(flattenWrapperStyles.backgroundColor).getBrightness() > 180,
			wrapperBorderRadius = extractBorderRadius(flattenWrapperStyles);

		return <View
			id={this.props.id} {...nativeProps}
			accessible={this.props.accessible}
			accessibilityLabel={this.props.accessibilityLabel}
			accessibilityComponentType={this.props.accessibilityComponentType}
			accessibilityTraits={this.props.accessibilityTraits}
			onAccessibilityTap={this.props.onAccessibilityTap}
			onMagicTap={this.props.onMagicTap}
			onMouseLeave={this.onMouseLeave}
			onMouseEnter={this.onMouseEnter}
			ref={(instance) => { this.wrapperView = instance; }} collapsable={false}
			style={[this.props.wrapperStyle, platformStyles]}
			onLayout={this.onLayout}>

			{this.renderShadowEffect(isLightBackground, wrapperBorderRadius)}
			{this.renderFadeEffect(isLightBackground, wrapperBorderRadius)}
			{this.renderRippleEffect(isLightBackground, wrapperBorderRadius)}

			<TouchableOpacity
				disabled={this.props.disabled}
				activeOpacity={this.props.minActiveOpacity}
				style={this.props.innerStyle}
				onPressIn={this.onPressIn}
				onPressOut={this.onPressOut}
				onPress={this.onPress}
				onLongPress={this.props.onLongPress}
				delayPressIn={this.props.delayPressIn}
				delayPressOut={this.props.delayPressOut}
				delayLongPress={this.props.delayLongPress}
				hitSlop={this.props.hitSlop}
				pressRetentionOffset={this.props.pressRetentionOffset}
				onStartShouldSetResponderCapture={() => !this.props.disabled}>
				<View pointerEvents="none">
					{this.props.children}
				</View>
			</TouchableOpacity>
		</View>;
	}

	renderShadowEffect(isLightBackground: Boolean, wrapperBorderRadius) {
		if (this.props.raise) {
			const shadowOpacity = this.raiseAnimation.interpolate({
					inputRange: [0, 1], outputRange: [this.props.raise ? 0.15 : 0, 0.6],
				}),
				shadow = this.props.raise ? {
					borderRadius: 3,
					shadowColor: '#666666',
					opacity: shadowOpacity,
					shadowOpacity: 1,
					shadowRadius: raiseShadowRadius,
					shadowOffset: { width: 0, height: 2 },
				} : {};

			return <Animated.View
				style={[styles.fullSizeAbsolute, shadow, wrapperBorderRadius]}/>;
		}

		return null;
	}

	renderFadeEffect(isLightBackground: Boolean, wrapperBorderRadius) {
		if (!this.props.fade) return <View/>;

		const opacity = this.fadeAnimation.interpolate({
				inputRange: [0, 1],
				outputRange: [0, this.props.fadeLevel],
				extrapolate: 'clamp',
			}),
			maskStyles = {
				backgroundColor: isLightBackground ? '#000000' : '#ffffff',
				opacity,
			};

		return <Animated.View style={[styles.fullSizeAbsolute, wrapperBorderRadius, maskStyles]}/>;
	}

	renderRippleEffect(isLightBackground: Boolean, wrapperBorderRadius) {
		if (!this.props.ripple) return <View/>;

		return <View style={[styles.fullSizeAbsolute, wrapperBorderRadius, { overflow: 'hidden' }]}>
			{this.renderRipples()}
		</View>;
	}

	renderRipples() {
		return this.state.ripples.map((ripple) => {
			return <RippleEffect
				key={ripple.index}
				style={ripple.style}
				index={ripple.index}
				initialOpacity={this.props.rippleInitialOpacity}
				initialScale={this.props.rippleInitialScale}
				speed={this.props.rippleAnimationSpeed}/>;
		});
	}

	onLayout = (e) => {
		const layout = e.nativeEvent.layout;

		if (this.props.onLayout) this.props.onLayout(e);
		this.setState({ layout });
	};

	onPress = (e) => {
		const { onPress } = this.props;
		if (onPress) setTimeout(() => onPress(e), 0);
	};

	onPressIn = (e) => {
		if (this.props.disabled) return;

		const flattenWrapperStyles = StyleSheet.flatten(this.props.wrapperStyle) || {},
			isLightBackground = tinyColor(flattenWrapperStyles.backgroundColor).getBrightness() > 180;

		if (this.props.raise) {
			this.playRaiseAnimation(1);
		}

		this.playFadeAnimation(1);

		const { locationX, locationY, offsetX, offsetY, pageX, pageY } = e.nativeEvent;

		this.wrapperView.measure((fx, fy, wrapperWidth, wrapperHeight, px, py) => {
			let rippleRadius = 0, ripplePosition;
			const touchX = locationX || offsetX, touchY = locationY || offsetY;

			if (this.props.staticRipple || !touchX) {
				rippleRadius = wrapperWidth / 2;
				ripplePosition = {
					top: (wrapperHeight / 2) - rippleRadius,
					left: (wrapperWidth / 2) - rippleRadius,
				};
			} else {
				/* Get the user's press location (4 places) to generate Ripple effect with correct radius!
				 * Math.sqrt(Math.pow(Xa - Xb) + Math.pow(Ya - Yb))
				 * */
				if (touchX > wrapperWidth / 2) {
					if (touchY > wrapperHeight / 2) {
						// console.log("Bottom-Right");
						rippleRadius = Math.sqrt((touchX * touchX) + (touchY * touchY));
					} else {
						// console.log("Top-Right");
						const paddedY = touchY - wrapperHeight;
						rippleRadius = Math.sqrt((touchX * touchX) + (paddedY * paddedY));
					}
				} else if (touchY > wrapperHeight / 2) {
					// console.log("Bottom-Left");
					const paddedX = touchX - wrapperWidth;
					rippleRadius = Math.sqrt((paddedX * paddedX) + (touchY * touchY));
				} else {
					// console.log("Top-Left");
					const paddedX = touchX - wrapperWidth, paddedY = touchY - wrapperHeight;
					rippleRadius = Math.sqrt((paddedX * paddedX) + (paddedY * paddedY));
				}

				rippleRadius *= 1.2;
				ripplePosition = {
					top: touchY - rippleRadius,
					left: touchX - rippleRadius,
				};
			}

			this.rippleIndex += 1;
			const defaultRippleColor = isLightBackground ? '#333333' : '#ffffff',
				newRipple = {
					index: this.rippleIndex,
					style: {
						width: rippleRadius * 2,
						height: rippleRadius * 2,
						borderRadius: rippleRadius,
						backgroundColor: this.props.rippleColor || defaultRippleColor,
						...ripplePosition,
					},
				};
			let ripples = [newRipple, ...this.state.ripples];

			if (ripples.length > MAX_PARTICLE_COUNT) {
				ripples = ripples.slice(0, MAX_PARTICLE_COUNT);
			}

			if (!this.willUnmount) this.setState({ ripples });
		});

		if (this.props.onPressIn) this.props.onPressIn(e);
	};

	onPressOut = (e, forceFade = false) => {
		if (this.props.raise) this.playRaiseAnimation(0);
		if (this.props.onPressOut && e) this.props.onPressOut(e);

		if (forceFade === true || !this.state.mouseInside) {
			this.playFadeAnimation(0);
		}
	};

	onMouseEnter = () => {
		!this.props.disabled && this.playFadeAnimation(1);
		this.setState({ mouseInside: true });

		if (!this.props.disabled && this.props.tooltip) {
			this.wrapperView.measure((x, y, width, height, pageX, pageY) => {
				this.context.ruuiStore.dispatch(appActions.toggleTooltip(true, {
					targetLayout: { x: pageX, y: pageY, width, height },
					direction: this.props.tooltipDirection,
					positionSpacing: this.props.tooltipPositionSpacing,
					positionOffset: this.props.tooltipPositionOffset,
					content: this.props.tooltip,
					wrapperStyle: this.props.tooltipWrapperStyle,
				}));
			});
		}
	};

	onMouseLeave = () => {
		this.onPressOut(null, true);
		this.setState({ mouseInside: false });

		if (!this.props.disabled && this.props.tooltip) {
			this.context.ruuiStore.dispatch(appActions.toggleTooltip(false));
		}
	};

	playRaiseAnimation = (toValue: Number) => {
		if (this.raisingAnimation) this.raisingAnimation.clear();

		const animations = [
			Animated.timing(this.raiseAnimation, {
				toValue,
				duration: 500,
				easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
			}),
		];

		this.raisingAnimation = Animated.parallel(animations).start();
	};

	playFadeAnimation = (toValue: Number) => {
		if (this.fadingAnimation) this.fadingAnimation.clear();

		this.fadingAnimation = Animated.timing(this.fadeAnimation, {
			toValue,
			duration: 800,
			easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
		}).start();
	};
}

function extractBorderRadius(baseStyles) {
	return [
		'borderRadius',
		'borderTopLeftRadius',
		'borderTopRightRadius',
		'borderBottomLeftRadius',
		'borderBottomRightRadius',
	].reduce((accumulate, currentAttribute) => {
		if (baseStyles[currentAttribute]) {
			accumulate[currentAttribute] = baseStyles[currentAttribute];
		}

		return accumulate;
	}, {});
}

const raiseShadowRadius = isIos ? 4 : 10;
const styles = StyleSheet.create({
	fullSizeAbsolute: {
		position: 'absolute',
		top: 0, bottom: 0, right: 0, left: 0,
	},
});
