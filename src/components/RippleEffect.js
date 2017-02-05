import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';

export class RippleEffect extends Component {
  constructor (props) {
    super(props);
    this.state = {
      expandAnimation: new Animated.Value(0)
    };
  }

  componentDidMount () {
    Animated.timing(this.state.expandAnimation, {
      toValue: 1,
      duration: this.props.speed || 750,
      easing: Easing.out(Easing.bezier(0.445, 0.05, 0.55, 0.95)),
    }).start()
  }

  render () {
    let opacity = this.state.expandAnimation.interpolate({
      inputRange: [0, 1], outputRange: [0.2, 0]
    }), scale = this.state.expandAnimation.interpolate({
        inputRange: [0, 1], outputRange: [0, 1]
    }), styles = {
      position: 'absolute',
      ...this.props.style,
      transform: [{ scale }],
      opacity,
    };

    return <Animated.View pointerEvents="none" style={styles}/>
  }
}

export default RippleEffect;