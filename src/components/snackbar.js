import React, { Component } from 'react';
import { Animated, Easing, View, Text, StyleSheet } from 'react-native';

import { Style } from '../typeDefinition';

type Props = {
	edge: 'bottom' | 'top',
	edgeOffset: number,
	itemHeight: number,
	index: number,
	aliveIndex?: number,
	closeable?: boolean,
	onStartTimeout: Function,
	onTimeout: Function,
	configs: Object,
}

class Snackbar extends Component {
	props: Props;

	constructor(props) {
		super(props);
		const initialPosition = props.aliveIndex - 1;
		this.positionAnimation = new Animated.Value(initialPosition);
		this.firstItemAnimation = new Animated.Value(0);
	}

	componentDidUpdate(prevProps) {
		const { aliveIndex, } = this.props;

		if (prevProps.aliveIndex !== aliveIndex) {
			Animated.timing(this.positionAnimation, {
				toValue: aliveIndex, duration: 1000,
				easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
			}).start();

			if (prevProps.aliveIndex === 0 && aliveIndex !== -1) {
				Animated.timing(this.firstItemAnimation, {
					toValue: aliveIndex === 0 ? 0 : 1,
					duration: 1000,
					easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
				}).start();
			}
		}
	}

	componentDidMount() {
		const { configs, aliveIndex, onStartTimeout, onTimeout, } = this.props;

		Animated.timing(this.positionAnimation, {
			toValue: aliveIndex, duration: 1000,
			easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
		}).start(() => {
			this.timeout = setTimeout(() => {
				onStartTimeout(configs);

				Animated.timing(this.positionAnimation, {
					toValue: aliveIndex, duration: 1000,
					easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
				}).start(() => onTimeout(configs));
			}, configs.timeout || 5000);
		});
	}

	render() {
		const { configs, edge, edgeOffset, itemHeight, index, } = this.props,
			contentRenderer = configs.contentRenderer || defaultContentRenderer,
			velocity = edge === 'top' ? itemHeight : -itemHeight,
			borderRadius = this.firstItemAnimation.interpolate({
				inputRange: [0, 1], outputRange: [0, 3],
			}),
			marginHorizontal = this.firstItemAnimation.interpolate({
				inputRange: [0, 1], outputRange: [0, 12],
			}),
			offset = this.positionAnimation.interpolate({
				inputRange: [0, 100], outputRange: [0, 100 * velocity],
			}),
			containerStyles = {
				zIndex: -index + 100,
				borderRadius, marginHorizontal,
				transform: [{ translateY: offset }],
			};

		if (edge === 'top') {
			containerStyles.top = edgeOffset;
		} else {
			containerStyles.bottom = edgeOffset;
		}

		return <Animated.View
			style={[styles.container, configs.containerStyle, containerStyles]}>
			{contentRenderer(configs)}
		</Animated.View>;
	}
}

export default Snackbar;

function defaultContentRenderer(configs) {
	return <Text
		numberOfLines={1}
		style={styles.message}>{configs.message}</Text>;
}

const styles = StyleSheet.create({
	container: {
		padding: 14, marginTop: 6,
		backgroundColor: '#454545',
		position: 'absolute', left: 0, right: 0,
	},
	message: {
		color: '#ffffff',
	},
});
