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
};

class Snackbar extends Component {
	props: Props;

	constructor(props) {
		super(props);
		const initialPosition = this.props.aliveIndex - 1;
		this.state = {
			positionAnimation: new Animated.Value(initialPosition),
			firstItemAnimation: new Animated.Value(0),
			lastPosition: initialPosition,
			currentPosition: this.props.aliveIndex,
		};
	}

	static defaultProps = {
		contentRenderer: defaultContentRenderer,
	};

	componentWillReceiveProps(nextProps) {
		if (nextProps.aliveIndex !== this.props.aliveIndex) {
			this.setState({
				lastPosition: this.props.aliveIndex,
				currentPosition: nextProps.aliveIndex,
			});

			Animated.timing(this.state.positionAnimation, {
				toValue: nextProps.aliveIndex, duration: 1000,
				easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
			}).start();

			if (this.props.aliveIndex === 0 && nextProps.aliveIndex !== -1) {
				Animated.timing(this.state.firstItemAnimation, {
					toValue: nextProps.aliveIndex === 0 ? 0 : 1,
					duration: 1000,
					easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
				}).start();
			}
		}
	}

	componentDidMount() {
		Animated.timing(this.state.positionAnimation, {
			toValue: this.state.currentPosition, duration: 1000,
			easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
		}).start(() => {
			this.timeout = setTimeout(() => {
				this.props.onStartTimeout(this.props.configs);

				Animated.timing(this.state.positionAnimation, {
					toValue: this.props.aliveIndex, duration: 1000,
					easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
				}).start(() => {
					this.props.onTimeout(this.props.configs);
				});
			}, this.props.configs.timeout || 5000);
		});
	}

	render() {
		const contentRenderer = this.props.configs.contentRenderer || defaultContentRenderer,
			velocity = this.props.edge === 'top' ? this.props.itemHeight : -this.props.itemHeight,
			borderRadius = this.state.firstItemAnimation.interpolate({
				inputRange: [0, 1], outputRange: [0, 3],
			}),
			marginHorizontal = this.state.firstItemAnimation.interpolate({
				inputRange: [0, 1], outputRange: [0, 12],
			}),
			offset = this.state.positionAnimation.interpolate({
				inputRange: [0, 100], outputRange: [0, 100 * velocity],
			}),
			containerStyles = {
				zIndex: -this.props.index + 100,
				borderRadius, marginHorizontal,
				transform: [{ translateY: offset }],
			};

		if (this.props.edge === 'top') {
			containerStyles.top = this.props.edgeOffset;
		} else {
			containerStyles.bottom = this.props.edgeOffset;
		}

		return <Animated.View
			style={[styles.container, this.props.configs.containerStyle, containerStyles]}>
			{contentRenderer(this.props.configs)}
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
