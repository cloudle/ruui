import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';
import { Style } from '../typeDefinition';

type Props = {
	initialOpacity?: number,
	initialScale?: number,
	speed?: number,
	style: Style,
};

export default class RuuiRippleEffect extends Component<any, Props, any> {
	props: Props;

	static defaultProps = {
		initialOpacity: 0.2,
		initialScale: 0.02,
		speed: 800,
	};

	constructor(props) {
		super(props);
		this.expandAnimation = new Animated.Value(0);
	}

	componentDidMount() {
		Animated.timing(this.expandAnimation, {
			toValue: 1,
			duration: this.props.speed,
			easing: Easing.out(Easing.bezier(0.445, 0.05, 0.55, 0.95)),
		}).start();
	}

	render() {
		const opacity = this.expandAnimation.interpolate({
				inputRange: [0, 0.5, 1], outputRange: [this.props.initialOpacity, 0.1, 0],
			}), scale = this.expandAnimation.interpolate({
				inputRange: [0, 0.1, 0.5, 1], outputRange: [this.props.initialScale, 0.4, 0.8, 1],
			}), styles = {
				position: 'absolute',
				...this.props.style,
				transform: [{ scale }],
				opacity,
			};

		return <Animated.View pointerEvents="none" style={styles}/>;
	}
}
