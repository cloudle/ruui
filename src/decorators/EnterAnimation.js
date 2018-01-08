import React from 'react';
import { Animated, Easing } from 'react-native';

export default function ({
		speed = 500, delay = 0, fromValue = 0, toValue = 1,
		easing = Easing.out(Easing.cubic),
	} = {}) {
	return function (BaseComponent) {
		return class EnterAnimationEnhancer extends BaseComponent {
			constructor(props) {
				super(props);
				this.state = {
					enterAnimation: new Animated.Value(toValue),
				};
			}

			componentDidMount() {
				this.state.enterAnimation.setValue(fromValue);

				setTimeout(() => {
					Animated.timing(this.state.enterAnimation, {
						toValue, easing,
						duration: speed,
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
