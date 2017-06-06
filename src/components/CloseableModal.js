import React, { Component } from 'react';
import { Animated, TouchableWithoutFeedback, View, StyleSheet } from 'react-native';

type Props = {
	configs?: any,
	animation?: any,
	active?: boolean,
	onRequestClose: Function,
};

export default class CloseableModal extends Component<any, Props, any> {
	props: Props;

	render() {
		const containerOpacity = this.props.animation.interpolate({
				inputRange: [0, 1], outputRange: [0, 1],
			}),
			scale = this.props.animation.interpolate({
				inputRange: [0, 1], outputRange: [this.props.active ? 1.4 : 0.9, 1],
			}),
			translateY = this.props.animation.interpolate({
				inputRange: [0, 1], outputRange: [150, 0],
			}),
			fullScreenStyles = this.props.configs.fullScreen ? {} : {
				alignItems: 'center', justifyContent: 'center',
			},
			containerStyles = {
				opacity: containerOpacity,
				transform: this.props.configs.fullScreen ? [{ translateY }] : [{ scale }],
			},
			InnerComponent = this.props.configs.component || this.props.configs.Component;

		return <Animated.View style={[styles.container, fullScreenStyles, containerStyles]}>
			{this.props.configs.tapToClose ? <TouchableWithoutFeedback
				onPress={() => this.props.onRequestClose(this.props.configs)}>
					<View style={styles.touchableMask}/>
				</TouchableWithoutFeedback> : <View/>}

			{InnerComponent ? <InnerComponent
				animation={this.props.animation}
				configs={this.props.configs}/>
				: <View />}
		</Animated.View>;
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0, right: 0, left: 0, bottom: 0,
	},
	touchableMask: {
		position: 'absolute',
		top: 0, right: 0, left: 0, bottom: 0,
	},
});