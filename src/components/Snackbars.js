import React, { Component } from 'react';
import { Animated, Easing, View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import Snackbar from './Snackbar';
import { horizontalSnappings } from '../utils';
import * as appActions from '../utils/store/appAction';

type Props = {
	dispatch?: Function,
	margin?: number,
	minWidth?: number,
	snackBars?: Object,
	animationSpeed?: number,
};

const snackbarRadius = 3;

@connect(({ app }) => {
	return {
		snackBars: app.snackBars,
	};
})

export default class Snackbars extends Component<any, Props, any> {
	props: Props;

	static defaultProps = {
		animationSpeed: 1000,
		minWidth: 300,
		margin: 15,
	};

	constructor(props) {
		super(props);
		this.state = {
			enterAnimation: new Animated.Value(1),
			currentBarLength: this.props.snackBars.length,
			previousBarLength: 0,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.snackBars.length !== this.props.snackBars.length) {
			this.setState({
				currentBarLength: nextProps.snackBars.length,
				previousBarLength: this.props.snackBars.length,
			});

			const isInsert = nextProps.snackBars.length > this.props.snackBars.length;
			this.playEnterAnimation(isInsert ? 0 : 1);
		}
	}

	render() {
		const snappingStyles = horizontalSnappings(this.props.margin, this.props.minWidth),
			translateY = this.state.enterAnimation.interpolate({
				inputRange: [0, 1], outputRange: [
					53 * this.state.previousBarLength, 53 * this.state.currentBarLength],
			}),
			containerAnimationStyles = { transform: [{ translateY }], };

		return <Animated.View
			style={[styles.container, snappingStyles, containerAnimationStyles]}>
			{this.props.snackBars.map((barOptions, i) => {
				const containerStyles = i === this.props.snackBars.length - 1 ? {
					borderBottomLeftRadius: 0,
					borderBottomRightRadius: 0,
				} : {};

				return <Snackbar
					key={barOptions.id} configs={barOptions}
					containerStyle={containerStyles}
					timeout={3000 + (i * 3000)}
					onTimeout={this.onBarTimeout}/>;
			})}
		</Animated.View>;
	}

	playEnterAnimation = (toValue) => {
		if (this.enterAnimation) this.enterAnimation.clear();

		const animations = [
			Animated.timing(this.state.enterAnimation, {
				toValue,
				duration: this.props.animationSpeed,
				easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
			}),
		];

		this.animation = Animated.parallel(animations).start();
	};

	onBarTimeout = (configs) => {
		this.props.dispatch(appActions.destroySnackBar(configs));
	};
}

const snackBarHeight = 53;

const styles = StyleSheet.create({
	container: {
		position: 'absolute', bottom: 0,
		borderTopLeftRadius: snackbarRadius, borderTopRightRadius: snackbarRadius,
	},
	message: {
		color: '#ffffff',
	},
});