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
import { debounce } from '../utils';

export class ResponsibleTouchArea extends Component {
  rippleIndex = 0;

  static propTypes = {
    wrapperStyle: React.PropTypes.any,
    innerStyle: React.PropTypes.any,
    staticRipple: React.PropTypes.bool,
    rippleColor: React.PropTypes.string,
	  minActiveOpacity: React.PropTypes.number,
    onPress: React.PropTypes.func,
    onLayout: React.PropTypes.func,
    onMouseEnter: React.PropTypes.func,
    onMouseLeave: React.PropTypes.func,
  };

  static defaultProps = {
    staticRipple: false,
    rippleColor: '#FFFFFF',
	  minActiveOpacity: 0.8,
  };

  constructor (props) {
    super(props);
    this.state = {
      ripples: [],
      raiseAnimation: new Animated.Value(0),
    };

    if (this.props.debounce) {
      this.handlePress = debounce(this.handlePress.bind(this), this.props.debounce);
    }
  }

  renderRipples () {
    return this.state.ripples.map(ripple => {
      return <RippleEffect
        key={ripple.index}
        style={ripple.style}
        index={ripple.index}
        speed={this.props.rippleAnimationSpeed}
      />;
    })
  }

  render () {
    let InnerComponent = this.props.disabled ? View : TouchableOpacity,
      containerStyles = {overflow: 'hidden', backgroundColor: 'transparent'};

    const shadowOpacity = this.state.raiseAnimation.interpolate({
      inputRange: [0, 1], outputRange: [this.props.raise ? 0.25 : 0, 0.8],
    }), shadows = {
      position: 'absolute',
      top: 0, left: 0, bottom: 0, right: 0,
      borderRadius: 3,
      shadowColor: '#666666',
      opacity: shadowOpacity,
      shadowOpacity: 1,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 2 }
    };

    return <View
      onMouseLeave={this::onMouseLeave}
      onMouseEnter={this::onMouseEnter}
      className="touchable"
      ref="wrapperView" collapsable={false}
      style={[this.props.wrapperStyle, {overflow: 'hidden'}]}
      onLayout={this.props.onLayout}>

      <Animated.View style={[styles.fullSizeAbsolute, shadows]}/>
	    <View style={styles.fullSizeAbsolute}>
		    {this.renderRipples()}
	    </View>

      <InnerComponent
        activeOpacity={this.props.minActiveOpacity}
        style={this.props.innerStyle}
        onPressIn={this::onPressIn}
        onPressOut={this::onPressOut}
        onPress={this::onPress}
        onStartShouldSetResponderCapture={() => true}>

		    {this.props.children}
      </InnerComponent>
    </View>
  }
}

function onPress (e) {
	!this.props.disabled && this.props.onPress && this.props.onPress(e);
}

function onPressIn (e) {
	if (this.props.disabled) return;

	if (this.props.raise) {
    this::playAnimation(1);
  }

	let event = e.nativeEvent, { locationX, locationY, pageX, pageY } = event;

	this.refs.wrapperView.measure((fx, fy, wrapperWidth, wrapperHeight, px, py) => {
		let ripplePosition, rippleRadius = 0, touchX = pageX - px, touchY = pageY - py;

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

		let newRipple = {
			index: this.rippleIndex++,
			style: {
				width: rippleRadius * 2,
				height: rippleRadius * 2,
				borderRadius: rippleRadius,
				backgroundColor: this.props.rippleColor,
				...ripplePosition
			}
		}, ripples = [newRipple, ...this.state.ripples];

		if (ripples.length > MAX_PARTICLE_COUNT) {
			ripples = ripples.slice(0, MAX_PARTICLE_COUNT);
		}

		this.setState({ ripples });
	});

	this.props.onPressIn && this.props.onPressIn(e);
}

function onPressOut () {
  this::playAnimation(0);
}

function onMouseEnter () {

}

function onMouseLeave () {
  return this::onPressOut;
}

function playAnimation (toValue: Number) {
	if (this.animation) this.animation.clear();

	let animations = [
		Animated.timing(this.state.raiseAnimation, {
			toValue,
			duration: 500,
			easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
		})
	];

	this.animation = Animated.parallel(animations).start();
}

const styles = StyleSheet.create({
	fullSizeAbsolute: {
		position: 'absolute',
		top: 0,  bottom: 0, right: 0, left: 0,
		overflow: 'hidden',
	}
});

export default ResponsibleTouchArea;
