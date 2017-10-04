import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import { isBrowser } from '../utils';
import * as appActions from '../utils/store/appAction';
import { Style, Element, SnappingDirection, Layout } from '../typeDefinition';

type Props = {
	id?: string,
	nativeID?: string,
	testID?: string,
	accessible?: boolean,
	accessibilityLabel?: any,
	accessibilityComponentType?: AccessibilityComponentType,
	accessibilityTraits?: AccessibilityTrait,
	dispatch?: Function,
	dropdownEvent?: 'onPress' | 'onLongPress',
	onPress?: Function,
	onLongPress?: Function,
	delayLongPress?: number,
	style?: Style,
	children?: Element,
	containerLayout?: Layout,
	dropdownComponent?: any,
	dropdownWrapperStyle?: Style,
	dropdownContext?: Object,
	dropdownDirection?: SnappingDirection,
	dropdownSpacing?: number,
	dropdownOffset?: Object,
};

@connect(({ app }) => {
	return {

	};
})

export default class DropdownContainer extends Component {
	props: Props;

	static DropdownEvents = {
		onPress: 'onPress',
		onLongPress: 'onLongPress',
	};

	static defaultProps = {
		dropdownEvent: 'onPress',
		dropdownDirection: 'bottom',
		dropdownSpacing: 10,
		offset: { top: 0, left: 0 },
	};

	render() {
		const nativeProps = isBrowser ? {} : {
			nativeID: this.props.nativeID,
			testID: this.props.testID,
		};

		return <TouchableOpacity
			onPress={this.onPress}
			onLongPress={this.onLongPress}
			delayLongPress={this.props.delayLongPress}>
			<View
				id={this.props.id} {...nativeProps}
				accessible={this.props.accessible}
				accessibilityLabel={this.props.accessibilityLabel}
				accessibilityComponentType={this.props.accessibilityComponentType}
				accessibilityTraits={this.props.accessibilityTraits}
				onAccessibilityTap={this.props.onAccessibilityTap}
				onMagicTap={this.props.onMagicTap}
				style={this.props.style}
				ref={(container) => { this.container = container; }}>
				{this.props.children}
			</View>
		</TouchableOpacity>;
	}

	onPress = (e) => {
		if (this.props.onPress) this.props.onPress(e);
		if (this.props.dropdownEvent === 'onPress') this.toggleDropdown();
	};

	onLongPress = (e) => {
		if (this.props.onLongPress) this.props.onLongPress(e);
		if (this.props.dropdownEvent === 'onLongPress') this.toggleDropdown();
	};

	toggleDropdown = () => {
		this.container.measure((a, b, width, height, px, py) => {
			this.props.dispatch(appActions.toggleDropdown(true, {
				wrapperStyle: this.props.dropdownWrapperStyle,
				component: this.props.dropdownComponent,
				containerLayout: this.props.containerLayout || { x: px, y: py, width, height, },
				direction: this.props.dropdownDirection,
				spacing: this.props.dropdownSpacing,
				offset: this.props.dropdownOffset,
				context: this.props.dropdownContext,
			}));
		});
	};
}

const styles = StyleSheet.create({
	container: {

	},
});