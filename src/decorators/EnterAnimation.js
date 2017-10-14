import React from 'react';
import { Animated, Easing } from 'react-native';

export default function ({
		enterSpeed = 500,
		delay = 0,
	} = {}) {
	return function (BaseComponent) {
		return class EnterAnimationEnhancer extends BaseComponent {
			constructor(props) {
				super(props);
				this.state = {
					enterAnimation: new Animated.Value(1),
				};
			}

			componentDidMount() {
				this.state.positionAnimation.setValue(0);

				setTimeout(() => {
					Animated.timing(this.state.enterAnimation, {
						toValue: 1,
						duration: enterSpeed,
						easing: Easing.out(Easing.cubic),
					}).start(() => {
						this.setState({ animationFinished: true });
						super.animationDidFinish && super.animationDidFinish();
					});
				}, delay);

				super.componentDidMount && super.componentDidMount();
			}
		};
	};
}
