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
		const { configs = {}, animation, } = this.props,
			containerPropsGenerator = configs.containerProps || defaultContainerPropsGenerator,
			containerProps = containerPropsGenerator(animation, configs, this.props.active),
			InnerComponent = this.props.configs.component || this.props.configs.Component;

		if (configs.containerProps && !containerProps.style) {
			containerProps.style = defaultContainerPropsGenerator(
				animation, configs, this.props.active).style;
		}

		return <Animated.View {...containerProps}>
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

export function defaultContainerPropsGenerator(animation, configs, isOpening) {
	const containerOpacity = animation.interpolate({
			inputRange: [0, 1], outputRange: [0, 1],
		}),
		scale = animation.interpolate({
			inputRange: [0, 1], outputRange: [isOpening ? 1.4 : 0.9, 1],
		}),
		translateY = animation.interpolate({
			inputRange: [0, 1], outputRange: [150, 0],
		}),
		fullScreenStyles = configs.fullScreen ? {} : {
			alignItems: 'center', justifyContent: 'center',
		},
		containerStyles = {
			opacity: containerOpacity,
			transform: configs.fullScreen ? [{ translateY }] : [{ scale }],
		};

	return { style: [styles.container, fullScreenStyles, containerStyles], };
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