import React, { Component } from 'react';
import { Animated, Easing, View, TouchableWithoutFeedback, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import * as appActions from '../utils/store/appAction';
import { Style, Element, DropdownConfigs } from '../typeDefinition';

type Props = {
	dispatch?: Function,
	active?: boolean,
	configs?: DropdownConfigs,
};

@connect(({ app }) => {
	return {
		active: app.activeDropdown.active,
		configs: app.activeDropdown.configs,
	};
})

export default class Dropdown extends Component {
	props: Props;

	constructor(props) {
		super(props);
		this.state = {
			enterAnimation: new Animated.Value(0),
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.active === true) {
			this.state.enterAnimation.setValue(0);
			Animated.timing(this.state.enterAnimation, {
				toValue: 1,
				duration: 500,
				easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
			}).start();
		}
	}

	render() {
		return this.props.active ? <View style={styles.container}>
			{this.props.configs.tapToClose ? <TouchableWithoutFeedback
				onPress={this.closeModal}>
				<View style={styles.touchableMask}/>
			</TouchableWithoutFeedback> : <View/>}

			{this.renderDropDown()}
		</View> : <View/>;
	}

	renderDropDown() {
		const configs = this.props.configs,
			context = configs.context || {},
			initialPosition = configs.position || { left: 0, top: 0, },
			InnerComponent = configs.component || configs.Component || EmptyDropdown,
			flattenWrapperStyle = StyleSheet.flatten(configs.wrapperStyle),
			wrapperBorderRadius = flattenWrapperStyle.borderRadius || 3,
			translate = this.state.enterAnimation.interpolate({
				inputRange: [0, 1], outputRange: [-15, 0],
			}), borderRadius = this.state.enterAnimation.interpolate({
				inputRange: [0, 0.5, 1], outputRange: [80, 20, wrapperBorderRadius],
			}), opacity = this.state.enterAnimation.interpolate({
				inputRange: [0, 1], outputRange: [0.2, 1],
				extrapolate: 'clamp',
			}),
			wrapperStyles = { top: initialPosition.top, left: initialPosition.left },
			containerStyles = {
				transform: [{ translateY: translate }],
				borderBottomLeftRadius: borderRadius,
				borderBottomRightRadius: borderRadius,
				opacity,
			};

		return <View
			style={wrapperStyles}
			ref={(container) => { this.container = container; }}>
			<Animated.View style={[styles.dropdownContainer, configs.wrapperStyle, containerStyles]}>
				<InnerComponent
					animation={this.state.enterAnimation}
					context={context}/>
			</Animated.View>
		</View>;
	}

	closeModal = () => {
		this.props.dispatch(appActions.toggleDropdown(false));
	};
}

function EmptyDropdown(props) {
	return <View>
		<Text>Default dropdown</Text>
	</View>;
}

const styles = StyleSheet.create({
	container: {
		zIndex: 1000,
		position: 'absolute',
		top: 0, bottom: 0, left: 0, right: 0,
	},
	touchableMask: {
		position: 'absolute',
		top: 0, bottom: 0, left: 0, right: 0,
	},
	dropdownContainer: {
		backgroundColor: '#ffffff',
		borderRadius: 3,
		overflow: 'hidden',
	},
});