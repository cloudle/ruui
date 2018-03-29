import React, { Component } from 'react';
import { Animated, Easing, View, TouchableWithoutFeedback, Text, StyleSheet } from 'react-native';

import { directionSnap } from '../utils';
import { connect } from '../utils/ruuiStore';
import * as appActions from '../utils/store/appAction';
import { Style, Element, DropdownConfigs } from '../typeDefinition';

type Props = {
	dispatch?: Function,
	active?: boolean,
	configs?: DropdownConfigs,
};

@connect(({ activeDropdown }) => {
	return {
		active: activeDropdown.active,
		configs: activeDropdown.configs,
	};
})

export default class Dropdown extends Component {
	props: Props;

	constructor(props) {
		super(props);
		this.state = {
			enterAnimation: new Animated.Value(0),
			layout: {},
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
			positionOffset = configs.offset || { top: 0, left: 0 },
			containerLayout = configs.containerLayout || { x: 0, y: 0, width: 0, height: 0 },
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
			snappingPosition = directionSnap(
				containerLayout.y, containerLayout.x,
				containerLayout.width, containerLayout.height,
				this.state.layout.width, this.state.layout.height,
				configs.direction, configs.spacing),
			wrapperStyles = {
				position: 'absolute',
				top: snappingPosition.top + positionOffset.top,
				left: snappingPosition.left + positionOffset.left,
			},
			containerStyles = {
				transform: [{ translateY: translate }],
				borderBottomLeftRadius: borderRadius,
				borderBottomRightRadius: borderRadius,
				opacity,
			};

		return <View style={wrapperStyles} onLayout={this.onLayout}>
			<Animated.View style={[styles.dropdownContainer, configs.wrapperStyle, containerStyles]}>
				<InnerComponent animation={this.state.enterAnimation} context={context}/>
			</Animated.View>
		</View>;
	}

	closeModal = () => {
		this.props.dispatch(appActions.toggleDropdown(false));
	};

	onLayout = ({ nativeEvent }) => {
		this.setState({ layout: nativeEvent.layout });
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