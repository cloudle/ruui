import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, TouchableWithoutFeedback, View, StyleSheet } from 'react-native';

import { valueAt } from '../utils';

type Props = {
	configs?: any,
	animation?: any,
	active?: boolean,
	onRequestClose: Function,
};

export default class RuuiCloseableModal extends Component<any, Props, any> {
	static props: Props;

	static contextTypes = {
		ruuiConfigs: PropTypes.object,
	};

	render() {
		const { configs = {}, animation, active } = this.props,
			globalConfigs = valueAt(this, 'context.ruuiConfigs.modal'),
			containerPropsGenerator = configs.containerProps || globalConfigs.containerProps,
			containerProps = containerPropsGenerator(animation, configs, active),
			InnerComponent = configs.component || configs.Component;

		if (configs.containerProps && !containerProps.style) {
			containerProps.style = globalConfigs.containerProps(
				animation, configs, active).style;
		}

		return <Animated.View {...containerProps}>
			{configs.tapToClose ? <TouchableWithoutFeedback
				onPress={this.onClose}>
				<View style={styles.touchableMask}/>
			</TouchableWithoutFeedback> : <View/>}

			{InnerComponent ? <InnerComponent
				animation={animation}
				configs={configs}
				close={this.onClose}/>
				: <View />}
		</Animated.View>;
	}

	onClose = () => {
		const { configs, onRequestClose, } = this.props;
		onRequestClose(configs);
	};
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

export const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0, right: 0, left: 0, bottom: 0,
	},
	touchableMask: {
		position: 'absolute',
		top: 0, right: 0, left: 0, bottom: 0,
	},
});
