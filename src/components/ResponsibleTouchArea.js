import tinyColor from 'tinycolor2';
import React, { Component } from 'react';
import { Animated, PanResponder, Easing, TouchableOpacity, View, StyleSheet } from 'react-native';
import RippleEffect from './RippleEffect';
import Tooltip from './Tooltip';
import { debounce, isIos, isBrowser } from '../utils';
import { Style, Element } from '../typeDefinition';

type Props = {
	wrapperStyle?: Style,
	innerStyle?: Style,
	tooltip?: string,
	tooltipWrapperStyle?: Style,
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
	onLayout?: Function,
	onMouseEnter?: Function,
	onMouseLeave?: Function,
	fadeLevel?: number,
	children?: Element,
	onPressIn?: Function,
};

const MAX_PARTICLE_COUNT = 5;

export default class ResponsibleTouchArea extends Component<any, Props, any> {
	props: Props;

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

	constructor(props) {
		super(props);
		this.state = {
			ripples: [],
			raiseAnimation: new Animated.Value(0),
			fadeAnimation: new Animated.Value(0),
			mouseInside: false,
		};

		if (this.props.debounce) {
			this.handlePress = debounce(this.handlePress.bind(this), this.props.debounce);
		}
	}

	render() {
		const InnerComponent = this.props.disabled ? View : TouchableOpacity;
		const flattenWrapperStyles = StyleSheet.flatten(this.props.wrapperStyle),
			isLightBackground = tinyColor(flattenWrapperStyles.backgroundColor).getBrightness() > 180,
			wrapperBorderRadius = extractBorderRadius(flattenWrapperStyles);

		return <View
			onMouseLeave={this.onMouseLeave}
			onMouseEnter={this.onMouseEnter}
			className="touchable"
			ref={(instance) => { this.wrapperView = instance; }} collapsable={false}
			style={[this.props.wrapperStyle]}
			onLayout={this.props.onLayout}>

			{this.renderShadowEffect(isLightBackground, wrapperBorderRadius)}
			{this.renderFadeEffect(isLightBackground, wrapperBorderRadius)}
			{this.renderRippleEffect(isLightBackground, wrapperBorderRadius)}
			{this.renderTooltip()}

			<InnerComponent
				activeOpacity={this.props.minActiveOpacity}
				style={this.props.innerStyle}
				onPressIn={this.onPressIn}
				onPressOut={this.onPressOut}
				onPress={this.onPress}
				onStartShouldSetResponderCapture={() => true}>
				<View pointerEvents="none">
					{this.props.children}
				</View>
			</InnerComponent>
		</View>;
	}

	renderShadowEffect(isLightBackground: Boolean, wrapperBorderRadius) {
		const shadowOpacity = this.state.raiseAnimation.interpolate({
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

	renderFadeEffect(isLightBackground: Boolean, wrapperBorderRadius) {
		if (!this.props.fade) return <View/>;

		const opacity = this.state.fadeAnimation.interpolate({
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

	renderTooltip() {
		if (this.props.tooltip && this.state.mouseInside) {
			return <Tooltip
				title={this.props.tooltip}
				wrapperStyle={this.props.tooltipWrapperStyle}/>;
		} else {
			return <View/>;
		}
	}

	onPress = (e) => {
		!this.props.disabled && this.props.onPress && this.props.onPress(e);
	};

	onPressIn = (e) => {
		if (this.props.disabled) return;

		const flattenWrapperStyles = StyleSheet.flatten(this.props.wrapperStyle),
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

			this.setState({ ripples });
		});

		if (this.props.onPressIn) this.props.onPressIn(e);
	};

	onPressOut = (forceFade = false) => {
		if (this.props.raise) this.playRaiseAnimation(0);
		if (forceFade === true || !this.state.mouseInside) {
			this.playFadeAnimation(0);
		}
	};

	onMouseEnter = () => {
		this.playFadeAnimation(1);
		this.setState({ mouseInside: true });
	};

	onMouseLeave = () => {
		this.onPressOut(true);
		this.setState({ mouseInside: false });
	};

	playRaiseAnimation = (toValue: Number) => {
		if (this.raiseAnimation) this.raiseAnimation.clear();

		const animations = [
			Animated.timing(this.state.raiseAnimation, {
				toValue,
				duration: 500,
				easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
			}),
		];

		this.raiseAnimation = Animated.parallel(animations).start();
	};

	playFadeAnimation = (toValue: Number) => {
		if (this.fadeAnimation) this.fadeAnimation.clear();

		this.fadeAnimation = Animated.timing(this.state.fadeAnimation, {
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