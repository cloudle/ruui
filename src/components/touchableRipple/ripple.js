import React, { useEffect, useRef, } from 'react';
import { Animated, Easing, StyleSheet, View, Text, } from 'react-native';

import { isBrowser, } from '../../utils';
import { Style, Element, } from '../../typeDefinition';

const { Value, timing, } = Animated;

type Props = {
	id?: String,
	style?: Style,
	speed?: Number,
	initialScale?: Number,
	initialOpacity?: Number,
	onAnimationComplete?: Function,
};

function Ripple(props: Props) {
	const { id, style, speed, initialOpacity, initialScale, onAnimationComplete, } = props;
	const { current: expand } = useRef(new Value(0));

	useEffect(() => {
		timing(expand, {
			toValue: 1,
			duration: speed,
			easing: Easing.out(Easing.bezier(0.445, 0.05, 0.55, 0.95)),
			useNativeDriver: !isBrowser,
		}).start();
	}, []);

	const opacity = expand.interpolate({
		inputRange: [0, 0.5, 1], outputRange: [initialOpacity, 0.1, 0], });
	const scale = expand.interpolate({
		inputRange: [0, 0.1, 0.5, 1], outputRange: [initialScale, 0.4, 0.8, 1], });
	const containerStyle = { position: 'absolute', transform: [{ scale }], opacity, };

	return <Animated.View style={[style, containerStyle]}/>;
}

Ripple.defaultProps = {
	speed: 800,
	initialOpacity: 0.2,
	initialScale: 0.02,
};

export default Ripple;

const styles = StyleSheet.create({
	container: {

	},
});
