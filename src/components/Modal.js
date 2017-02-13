import React, { Component } from 'react';
import { Animated, Easing, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { enterAnimation } from '../decorators';

import * as appActions from '../utils/store/appAction';

@connect(({app}) => {
	return {
		activeModal: app.activeModal,
	}
})

export default class Modal extends Component {
	constructor (props) {
		super(props);
		this.state = {
			enterAnimation: new Animated.Value(0),
			activeModal: this.props.activeModal,
		}
	}

	componentDidMount () {
		this::playAnimation(1);
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.activeModal != this.props.activeModal && !nextProps.activeModal) {
			this::playAnimation(0, () => {
				this.setState({activeModal: null});
			});
		} else {
			this.setState({activeModal: nextProps.activeModal});
		}
	}

	render () {
		let backgroundColor = this.state.enterAnimation.interpolate({
			inputRange: [0, 1], outputRange: ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.8)']
		}), containerStyles = {
			backgroundColor,
		};

		return this.state.activeModal ? <Animated.View
			style={[styles.container, containerStyles]}>
			<TouchableOpacity
				style={styles.innerTouchable}
				onPress={this::onBackdropPress}>
				{this.props.children}
			</TouchableOpacity>
		</Animated.View> : <View/>;
	}
}

function onBackdropPress () {
	this.props.dispatch(appActions.toggleSelect(false));
}

function playAnimation (toValue: Number, callback) {
	if (this.animation) this.animation.clear();

	let animations = [
		Animated.timing(this.state.enterAnimation, {
			toValue,
			duration: 1200,
			easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
		})
	];

	this.animation = Animated.parallel(animations).start(callback);
}

const styles = StyleSheet.create({
	container: {
		position: 'fixed',
		top: 0, left: 0, right: 0, bottom: 0,
	},
	innerTouchable: {
		flex: 1,
	}
});