import React, { Component } from 'react';
import { Animated, Easing, Text, StyleSheet } from 'react-native';
import { isBrowser } from '../utils';

export default class Tooltip extends Component {
	static propTypes = {
		title: React.PropTypes.string,
	};

	constructor(props) {
		super(props);
		this.state = {
			enterAnimation: new Animated.Value(0),
		};
	}

	componentDidMount() {
		Animated.timing(this.state.enterAnimation, {
			toValue: 1,
			duration: 500,
			easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
		}).start();
	}

	render() {
		const translate = this.state.enterAnimation.interpolate({
				inputRange: [0, 1], outputRange: [15, 0],
			}), borderRadius = this.state.enterAnimation.interpolate({
				inputRange: [0, 0.5, 1], outputRange: [50, 15, 3],
			}), opacity = this.state.enterAnimation.interpolate({
				inputRange: [0, 1], outputRange: [0.2, 1],
				extrapolate: 'clamp',
			}),
			containerStyles = {
				transform: [{ translateY: translate }],
				borderTopLeftRadius: borderRadius,
				borderTopRightRadius: borderRadius,
				opacity,
			};

		return <Animated.View style={[styles.container, containerStyles]}>
			<Text style={styles.title}>{this.props.title}</Text>
		</Animated.View>;
	}
}

const styles = StyleSheet.create({
	container: {
		position: isBrowser ? 'fixed' : 'absolute',
		marginTop: -30, marginLeft: 0,
		backgroundColor: 'rgb(97, 97, 97)',
		borderRadius: 3,
		padding: 5, paddingLeft: 8, paddingRight: 8,
	},
	title: {
		fontSize: 11, fontWeight: '300',
		color: '#f5f5f5',
	},
});