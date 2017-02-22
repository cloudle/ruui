import React, { Component } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Text,
	StyleSheet,
} from 'react-native';

const MAX_PARTICLE_COUNT = 5;
import RippleEffect from './RippleEffect';
import { debounce, isIos } from '../utils';
import tinyColor from 'tinycolor2';

export class ResponsibleTouchArea extends Component {
  rippleIndex = 0;

  static propTypes = {
    wrapperStyle: React.PropTypes.any,
    innerStyle: React.PropTypes.any,
    staticRipple: React.PropTypes.bool,
    rippleColor: React.PropTypes.string,
	  rippleInitialOpacity: React.PropTypes.number,
	  rippleInitialScale: React.PropTypes.number,
	  rippleAnimationSpeed: React.PropTypes.number,
	  fade: React.PropTypes.bool,
	  raise: React.PropTypes.bool,
    minActiveOpacity: React.PropTypes.number,
    onPress: React.PropTypes.func,
    onLayout: React.PropTypes.func,
    onMouseEnter: React.PropTypes.func,
    onMouseLeave: React.PropTypes.func,
	  fadeLevel: React.PropTypes.number,
  };

  static defaultProps = {
    staticRipple: false,
	  minActiveOpacity: 0.8,
	  raise: false,
	  fade: false,
	  fadeLevel: 0.1,
  };

  constructor (props) {
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

  render () {
    let InnerComponent = this.props.disabled ? View : TouchableOpacity;
    const flattenWrapperStyles = StyleSheet.flatten(this.props.wrapperStyle),
	    isLightBackground = tinyColor(flattenWrapperStyles.backgroundColor).getBrightness() > 180,
	    wrapperBorderRadius = extractBorderRadius(flattenWrapperStyles);

    return <View
      onMouseLeave={onMouseLeave.bind(this)}
      onMouseEnter={onMouseEnter.bind(this)}
      className="touchable"
      ref="wrapperView" collapsable={false}
      style={this.props.wrapperStyle}
      onLayout={this.props.onLayout}>

      {this.renderShadowEffect(isLightBackground, wrapperBorderRadius)}
      {this.renderFadeEffect(isLightBackground, wrapperBorderRadius)}
	    <View style={[styles.fullSizeAbsolute, wrapperBorderRadius, {overflow: 'hidden'}]}>
		    {this.renderRipples()}
	    </View>

      <InnerComponent
        activeOpacity={this.props.minActiveOpacity}
        style={this.props.innerStyle}
        onPressIn={onPressIn.bind(this, isLightBackground)}
        onPressOut={onPressOut.bind(this)}
        onPress={onPress.bind(this)}
        onStartShouldSetResponderCapture={() => true}>
				<View pointerEvents="none">
					{this.props.children}
				</View>
      </InnerComponent>
    </View>
  }

  renderShadowEffect (isLightBackground: Boolean, wrapperBorderRadius) {
		const shadowOpacity = this.state.raiseAnimation.interpolate({
				inputRange: [0, 1], outputRange: [this.props.raise ? 0.15 : 0, 0.6],
			}),
			shadow = this.props.raise ? {
				borderRadius: 3,
				shadowColor: '#666666',
				opacity: shadowOpacity,
				shadowOpacity: 1,
				shadowRadius: raiseShadowRadius,
				shadowOffset: { width: 0, height: 2 }
			} : {};

		return <Animated.View style={[styles.fullSizeAbsolute, wrapperBorderRadius, shadow]}/>
  }

  renderFadeEffect (isLightBackground: Boolean, wrapperBorderRadius) {
  	if (!this.props.fade) return;

  	const opacity = this.state.fadeAnimation.interpolate({
		  inputRange: [0, 1],
		  outputRange: [0, this.props.fadeLevel],
		  extrapolate: 'clamp',
	  }), maskStyles = {
  		backgroundColor: isLightBackground ? '#000000' : '#ffffff',
		  opacity
	  };

	  return <Animated.View style={[styles.fullSizeAbsolute, wrapperBorderRadius, maskStyles]}/>
  }

	renderRipples () {
		return this.state.ripples.map(ripple => {
			return <RippleEffect
				key={ripple.index}
				style={ripple.style}
				index={ripple.index}
				initialOpacity={this.props.rippleInitialOpacity}
				initialScale={this.props.rippleInitialScale}
				speed={this.props.rippleAnimationSpeed}/>
		})
	}
}

function onPress (e) {
	!this.props.disabled && this.props.onPress && this.props.onPress(e);
}

function onPressIn (isLightBackground: Boolean, e) {
	if (this.props.disabled) return;

	if (this.props.raise) {
    playRaiseAnimation.call(this, 1);
  }

	playFadeAnimation.call(this, 1);

	let { locationX, locationY, pageX, pageY } = e.nativeEvent;

	this.refs.wrapperView.measure((fx, fy, wrapperWidth, wrapperHeight, px, py) => {
		let ripplePosition, rippleRadius = 0, touchX = locationX, touchY = locationY;

		if (this.props.staticRipple) {
			rippleRadius = wrapperWidth / 2;
			ripplePosition = {
				top: (wrapperHeight / 2) - rippleRadius,
				left: (wrapperWidth / 2) - rippleRadius,
			}
		} else {
			//Get the user's press location (4 places) to generate Ripple effect with correct radius! Math.sqrt(Math.pow(Xa - Xb) + Math.pow(Ya - Yb))
			if (touchX > wrapperWidth / 2) {
				if (touchY > wrapperHeight / 2) {
					// console.log("Bottom-Right");
					rippleRadius = Math.sqrt(Math.pow(touchX, 2) + Math.pow(touchY, 2));
				} else {
					// console.log("Top-Right");
					rippleRadius = Math.sqrt(Math.pow(touchX, 2) + Math.pow(touchY - wrapperHeight, 2));
				}
			} else {
				if (touchY > wrapperHeight / 2) {
					// console.log("Bottom-Left");
					rippleRadius = Math.sqrt(Math.pow(touchX - wrapperWidth, 2) + Math.pow(touchY, 2));
				} else {
					// console.log("Top-Left");
					rippleRadius = Math.sqrt(Math.pow(touchX - wrapperWidth, 2) + Math.pow(touchY - wrapperHeight, 2));
				}
			}

			rippleRadius *= 1.2;
			ripplePosition = {
				top: touchY - rippleRadius,
				left: touchX - rippleRadius,
			};
		}

		let defaultRippleColor = isLightBackground ? '#333333' : '#ffffff',
			newRipple = {
				index: this.rippleIndex++,
				style: {
					width: rippleRadius * 2,
					height: rippleRadius * 2,
					borderRadius: rippleRadius,
					backgroundColor: this.props.rippleColor || defaultRippleColor,
					...ripplePosition
				}
			},
			ripples = [newRipple, ...this.state.ripples];

		if (ripples.length > MAX_PARTICLE_COUNT) {
			ripples = ripples.slice(0, MAX_PARTICLE_COUNT);
		}

		this.setState({ ripples });
	});

	this.props.onPressIn && this.props.onPressIn(e);
}

function onPressOut (forceFade = false) {
  if (this.props.raise) playRaiseAnimation.call(this, 0);
  if (forceFade == true || !this.state.mouseInside) {
  	playFadeAnimation.call(this, 0);
  }
}

function onMouseEnter () {
	playFadeAnimation.call(this, 1);
	this.setState({mouseInside: true});
}

function onMouseLeave () {
	onPressOut.call(this, true);
	this.setState({mouseInside: false});
}

function playRaiseAnimation (toValue: Number) {
	if (this.raiseAnimation) this.raiseAnimation.clear();

	let animations = [
		Animated.timing(this.state.raiseAnimation, {
			toValue,
			duration: 500,
			easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
		})
	];

	this.raiseAnimation = Animated.parallel(animations).start();
}

function playFadeAnimation (toValue: Number) {
	if (this.fadeAnimation) this.fadeAnimation.clear();

	this.fadeAnimation = Animated.timing(this.state.fadeAnimation, {
		toValue,
		duration: 800,
		easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
	}).start();
}

function extractBorderRadius (baseStyles) {
	return [ 'borderRadius'
	, 'borderTopLeftRadius'
	,	'borderTopRightRadius'
	,	'borderBottomLeftRadius'
	,	'borderBottomRightRadius'
	].reduce((accumulate, currentAttribute) => {
		if (baseStyles[currentAttribute]) {
			accumulate[currentAttribute] = baseStyles[currentAttribute];
		}

		return accumulate;
	}, {})
}

const styles = StyleSheet.create({
	fullSizeAbsolute: {
		position: 'absolute',
		top: 0, bottom: 0, right: 0, left: 0,
	}
});

const raiseShadowRadius = isIos ? 4 : 10;

export default ResponsibleTouchArea;
