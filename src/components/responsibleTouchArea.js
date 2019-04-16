import React, { Component } from 'react';
import PropTypes from 'prop-types';
import tinyColor from 'tinycolor2';
import { Animated, Easing, TouchableOpacity, View, StyleSheet, Platform } from 'react-native';

import RippleEffect from './rippleEffect';
import { debounce, isIos, } from '../utils';
import * as appActions from '../store/action/app';
import type { Style, Element, SnappingDirection, } from '../typeDefinition';

type Props = {
	children?: Element,
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
	fadeLevel?: number,
	raise?: boolean,
	debounce?: number,
	disabled?: boolean,
	activeOpacity?: number,
	onPress?: Function,
	onPressIn?: Function,
	onPressOut?: Function,
	onMouseEnter?: Function,
	onMouseLeave?: Function,
};

const MAX_PARTICLE_COUNT = 5;

class RuuiResponsibleTouchArea extends Component<any, Props, any> {
	static props: Props;

	static contextTypes = {
		ruuiStore: PropTypes.object,
	};

	static defaultProps = {
		staticRipple: false,
		activeOpacity: 0.7,
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
		};

		this.raiseAnimation = new Animated.Value(0);
		this.fadeAnimation = new Animated.Value(0);

		if (props.debounce) {
			this.handlePress = debounce(this.handlePress.bind(this), props.debounce);
		}
	}

	render() {
		const {
				children,
				wrapperStyle,
				innerStyle,
				disabled,
				onPressIn,
				onPressOut,
				onPress,
				ripple,
				fade,
				fadeLevel,
				raise,
				...otherProps } = this.props,
			flattenWrapperStyles = StyleSheet.flatten(wrapperStyle) || {},
			platformStyles = Platform.select({
				web: { cursor: 'pointer', userSelect: 'none' },
			}),
			isLightBackground = tinyColor(flattenWrapperStyles.backgroundColor).getBrightness() > 180,
			wrapperBorderRadius = extractBorderRadius(flattenWrapperStyles);

		return <View
			onMouseLeave={this.onMouseLeave}
			onMouseEnter={this.onMouseEnter}
			ref={(instance) => { this.wrapperView = instance; }}
			collapsable={false}
			style={[wrapperStyle, platformStyles]}>

			{raise && this.renderShadowEffect(raise, isLightBackground, wrapperBorderRadius)}
			{fade && this.renderFadeEffect(fade, fadeLevel, isLightBackground, wrapperBorderRadius)}
			{ripple && this.renderRippleEffect(isLightBackground, wrapperBorderRadius)}

			<TouchableOpacity
				disabled={disabled}
				style={innerStyle}
				onPressIn={this.onPressIn}
				onPressOut={this.onPressOut}
				onPress={this.onPress}
				onStartShouldSetResponderCapture={() => !disabled}
				{...otherProps}>
				<View pointerEvents="none">
					{children}
				</View>
			</TouchableOpacity>
		</View>;
	}

	renderShadowEffect(raise: Boolean, isLightBackground: Boolean, wrapperBorderRadius) {
		const shadowOpacity = this.raiseAnimation.interpolate({
				inputRange: [0, 1], outputRange: [raise ? 0.15 : 0, 0.6],
			}),
			shadow = raise && {
				borderRadius: 3,
				shadowColor: '#666666',
				opacity: shadowOpacity,
				shadowOpacity: 1,
				shadowRadius: raiseShadowRadius,
				shadowOffset: { width: 0, height: 2 },
			};

		return <Animated.View
			style={[styles.fullSizeAbsolute, shadow, wrapperBorderRadius]}/>;
	}

	renderFadeEffect(fade, fadeLevel, isLightBackground: Boolean, wrapperBorderRadius) {
		const opacity = this.fadeAnimation.interpolate({
				inputRange: [0, 1],
				outputRange: [0, fadeLevel],
				extrapolate: 'clamp',
			}),
			maskStyles = {
				backgroundColor: isLightBackground ? '#000000' : '#ffffff',
				opacity,
			};

		return <Animated.View style={[styles.fullSizeAbsolute, wrapperBorderRadius, maskStyles]}/>;
	}

	renderRippleEffect(isLightBackground: Boolean, wrapperBorderRadius) {
		return <View style={[styles.fullSizeAbsolute, wrapperBorderRadius, { overflow: 'hidden' }]}>
			{this.renderRipples()}
		</View>;
	}

	renderRipples() {
		const { ripples } = this.state,
			{ rippleInitialOpacity, rippleInitialScale, rippleAnimationSpeed } = this.props;

		return ripples.map((ripple) => {
			return <RippleEffect
				key={ripple.index}
				style={ripple.style}
				index={ripple.index}
				initialOpacity={rippleInitialOpacity}
				initialScale={rippleInitialScale}
				speed={rippleAnimationSpeed}/>;
		});
	}

	onPress = (e) => {
		const { onPress } = this.props;
		if (onPress) setTimeout(() => onPress(e), 0);
	};

	onPressIn = (e) => {
		const { ripples } = this.state,
			{ wrapperStyle, disabled, raise, staticRipple, rippleColor, onPressIn } = this.props;

		if (disabled) return;

		const flattenWrapperStyles = StyleSheet.flatten(wrapperStyle) || {},
			isLightBackground = tinyColor(flattenWrapperStyles.backgroundColor).getBrightness() > 180;

		if (raise) this.playRaiseAnimation(1);

		this.playFadeAnimation(1);

		const { locationX, locationY, offsetX, offsetY, pageX, pageY } = e.nativeEvent;

		this.wrapperView.measure((fx, fy, wrapperWidth, wrapperHeight, px, py) => {
			let rippleRadius = 0, ripplePosition;
			const touchX = locationX || offsetX, touchY = locationY || offsetY;

			if (staticRipple || !touchX) {
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
						backgroundColor: rippleColor || defaultRippleColor,
						...ripplePosition,
					},
				};
			let nextRipples = [newRipple, ...ripples];

			if (nextRipples.length > MAX_PARTICLE_COUNT) {
				nextRipples = nextRipples.slice(0, MAX_PARTICLE_COUNT);
			}

			if (!this.willUnmount) this.setState({ ripples: nextRipples });
		});

		if (onPressIn) onPressIn(e);
	};

	onPressOut = (e, forceFade = false) => {
		const { mouseInside } = this.state,
			{ raise, onPressOut } = this.props;

		if (raise) this.playRaiseAnimation(0);
		if (onPressOut && e) onPressOut(e);

		if (forceFade === true || !mouseInside) {
			this.playFadeAnimation(0);
		}
	};

	onMouseEnter = () => {
		const { ruuiStore } = this.context,
			{ disabled,
				tooltip,
				tooltipWrapperStyle,
				tooltipDirection,
				tooltipPositionSpacing,
				tooltipPositionOffset } = this.props;

		this.setState({ mouseInside: true });

		if (!disabled) {
			this.playFadeAnimation(1);

			if (tooltip) {
				this.wrapperView.measure((x, y, width, height, pageX, pageY) => {
					ruuiStore.dispatch(appActions.toggleTooltip(true, {
						targetLayout: { x: pageX, y: pageY, width, height },
						direction: tooltipDirection,
						positionSpacing: tooltipPositionSpacing,
						positionOffset: tooltipPositionOffset,
						content: tooltip,
						wrapperStyle: tooltipWrapperStyle,
					}));
				});
			}
		}
	};

	onMouseLeave = () => {
		const { ruuiStore } = this.context,
			{ disabled, tooltip } = this.props;

		this.onPressOut(null, true);
		this.setState({ mouseInside: false });

		if (!disabled && tooltip) {
			ruuiStore.dispatch(appActions.toggleTooltip(false));
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

export default RuuiResponsibleTouchArea;

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
