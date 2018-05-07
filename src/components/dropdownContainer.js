import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { isWeb } from '../utils';
import * as appActions from '../utils/store/appAction';
import { Style, Element, SnappingDirection, Layout, AccessibilityComponentType, AccessibilityTrait, } from '../typeDefinition';

type Props = {
	id?: String,
	nativeID?: String,
	testID?: String,
	accessible?: Boolean,
	accessibilityLabel?: any,
	accessibilityComponentType?: AccessibilityComponentType,
	accessibilityTraits?: AccessibilityTrait,
	className?: String,
	dispatch?: Function,
	dropdownEvent?: 'onPress' | 'onLongPress',
	onPress?: Function,
	onLongPress?: Function,
	onMagicTap?: Function,
	onAccessibilityTap?: Function,
	delayLongPress?: Number,
	style?: Style,
	wrapperStyle?: Style,
	children?: Element,
	containerLayout?: Layout,
	dropdownComponent?: Component,
	dropdownWrapperStyle?: Style,
	dropdownContext?: Object,
	dropdownDirection?: SnappingDirection,
	dropdownSpacing?: number,
	dropdownOffset?: Object,
	offset?: Object,
};

export default class RuuiDropdownContainer extends Component {
	static props: Props;
	static contextTypes = {
		ruuiStore: PropTypes.object,
	};

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

	constructor(props, context) {
		super(props);
		this.store = context.ruuiStore;
	}

	render() {
		const nativeProps = isWeb ? {} : {
			nativeID: this.props.nativeID,
			testID: this.props.testID,
		};

		return <TouchableOpacity
			style={this.props.wrapperStyle}
			onPress={this.onPress}
			onLongPress={this.onLongPress}
			delayLongPress={this.props.delayLongPress}>
			<View
				className={this.props.className}
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
			this.store.dispatch(appActions.toggleDropdown(true, {
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
