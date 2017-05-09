import React, { Component } from 'react';
import { Animated, Easing } from 'react-native';
import { Style } from '../typeDefinition';

type Props = {
	initialOpacity?: number,
	initialScale?: number,
	speed?: number,
	style: Style,
};

export class RippleEffect extends Component<any, Props, any> {
	props: Props;

	static defaultProps = {
		initialOpacity: 0.2,
		initialScale: 0,
		speed: 1000,
	};

	constructor(props) {
		super(props);
		this.state = {
			expandAnimation: new Animated.Value(0),
		};
	}

	componentDidMount() {
		Animated.timing(this.state.expandAnimation, {
			toValue: 1,
			duration: this.props.speed,
			easing: Easing.out(Easing.bezier(0.445, 0.05, 0.55, 0.95)),
		}).start();
	}

	render() {
		const opacity = this.state.expandAnimation.interpolate({
				inputRange: [0, 0.5, 1], outputRange: [this.props.initialOpacity, 0.1, 0],
			}), scale = this.state.expandAnimation.interpolate({
				inputRange: [0, 0.25, 1], outputRange: [this.props.initialScale, 0.8, 1],
			}), styles = {
				position: 'absolute',
				...this.props.style,
				transform: [{ scale }],
				opacity,
			};

		return <Animated.View pointerEvents="none" style={styles}/>;
	}
}

export default RippleEffect;