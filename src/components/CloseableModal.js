import React, { Component } from 'react';
import { Animated, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

type Props = {
	configs?: any,
	animation?: any,
};

export default class CloseableModal extends Component<any, Props, any> {
	props: Props;

	render() {
		const containerOpacity = this.props.animation.interpolate({
				inputRange: [0, 1], outputRange: [0, 1],
			}),
			containerStyles = {
				opacity: containerOpacity,
			},
			InnerComponent = this.props.configs.component || this.props.configs.Component;

		return <Animated.View style={[styles.container, containerStyles]}>
			{InnerComponent ? <InnerComponent /> : <View />}
		</Animated.View>;
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0, right: 0, left: 0, bottom: 0,
		alignItems: 'center', justifyContent: 'center',
	},
});