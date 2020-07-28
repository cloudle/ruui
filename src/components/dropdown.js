import React, { Component } from 'react';
import { Animated, Easing, View, TouchableWithoutFeedback, Text, StyleSheet } from 'react-native';

import { directionSnap, directionAnimatedConfigs, connect } from '../utils';
import * as appActions from '../utils/store/appAction';
import { DropdownConfigs } from '../typeDefinition';

type Props = {
	dispatch?: Function,
	active?: boolean,
	configs?: DropdownConfigs,
	screenSize?: { width?: number, height?: number },
};

@connect(() => ({}))

class RuuiDropdown extends Component {
	props: Props;

	constructor(props) {
		super(props);
		this.enterAnimation = new Animated.Value(0);
		this.state = {
			layout: {},
		};
	}

	componentDidMount() {
		this.playAnimation();
	}

	componentWillUnmount() {
		const { configs: { onClose } } = this.props;
		if (onClose) onClose();
	}

	playAnimation = () => {
		this.enterAnimation.setValue(0);
		Animated.timing(this.enterAnimation, {
			toValue: 1,
			duration: 800,
			easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
		}).start();
	}

	componentDidUpdate(prevProps) {
		const { active } = this.props;
		if (prevProps.active !== active && active) {
			this.playAnimation();
		}
	}

	render() {
		const { active, configs } = this.props;

		return active ? <View style={styles.container}>
			{configs.tapToClose ? <TouchableWithoutFeedback
				onPress={this.closeModal}>
				<View style={styles.touchableMask}/>
			</TouchableWithoutFeedback> : <View/>}
			{this.renderDropDown()}
		</View> : <View/>;
	}

	renderDropDown() {
		const { configs, screenSize } = this.props,
			{ layout, } = this.state,
			context = configs.context || {},
			positionOffset = configs.offset || { top: 0, left: 0 },
			containerLayout = configs.containerLayout || { x: 0, y: 0, width: 0, height: 0 },
			InnerComponent = configs.component || configs.Component || EmptyDropdown,
			flattenWrapperStyle = StyleSheet.flatten(configs.wrapperStyle) || {},
			finalBorderRadius = flattenWrapperStyle.borderRadius || 3,
			animatedConfigs = directionAnimatedConfigs(
				configs.direction, 10, this.enterAnimation, finalBorderRadius
			),
			snappingPosition = directionSnap(
				containerLayout.y, containerLayout.x,
				containerLayout.width, containerLayout.height,
				layout.width, layout.height,
				configs.direction, configs.spacing,
				screenSize,
			),
			wrapperStyles = {
				overflow: 'hidden',
				position: 'absolute',
				top: snappingPosition.top + positionOffset.top,
				left: snappingPosition.left + positionOffset.left,
				opacity: layout.width ? 1 : 0,
			},
			containerStyles = {
				transform: animatedConfigs.transform,
				opacity: animatedConfigs.opacity,
				...animatedConfigs.borderRadius,
			};

		return <View style={[wrapperStyles, { zIndex: configs.zIndex }]} onLayout={this.onLayout}>
			<Animated.View style={[styles.dropdownContainer, configs.wrapperStyle, containerStyles]}>
				<InnerComponent
					configs={configs}
					animation={this.enterAnimation}
					context={context}
					close={this.closeModal}/>
			</Animated.View>
		</View>;
	}

	closeModal = () => {
		const { dispatch, configs } = this.props;
		dispatch(appActions.toggleDropdown(false, configs));
	};

	onLayout = ({ nativeEvent }) => {
		this.setState({ layout: nativeEvent.layout });
	};
}

export default RuuiDropdown;

function EmptyDropdown(props) {
	return <View>
		<Text>Default dropdown</Text>
	</View>;
}

const styles = StyleSheet.create({
	container: {
		zIndex: 1000,
		position: 'absolute',
		overflow: 'hidden',
		top: 0, bottom: 0, left: 0, right: 0,
	},
	touchableMask: {
		position: 'absolute',
		overflow: 'hidden',
		top: 0, bottom: 0, left: 0, right: 0,
	},
	dropdownContainer: {
		backgroundColor: '#ffffff',
		borderRadius: 3,
		overflow: 'hidden',
	},
});
