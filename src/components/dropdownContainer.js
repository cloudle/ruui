import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, StyleSheet, findNodeHandle } from 'react-native';

import type { PositionOffset } from '../typeDefinition';
import * as appActions from '../utils/store/appAction';
import { Style, Element, SnappingDirection, Layout, } from '../typeDefinition';

type Props = {
	dispatch?: Function,
	dropdownEvent?: 'onPress' | 'onLongPress',
	onPress?: Function,
	onLongPress?: Function,
	style?: Style,
	wrapperStyle?: Style,
	children?: Element,
	containerLayout?: Layout,
	dropdownComponent?: Component,
	dropdownWrapperStyle?: Style,
	dropdownContext?: Object,
	dropdownDirection?: SnappingDirection,
	animatedDirection?: SnappingDirection,
	dropdownSpacing?: number,
	dropdownOffset?: PositionOffset,
	showArrow?: Boolean,
	arrowSize?: Number,
	arrowOffset?: PositionOffset,
	id ?: string | number,
	onClose ?: Function,
	tapToClose?: boolean,
	maskPointerEvents?: string,
};

class RuuiDropdownContainer extends Component {
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
		dropdownOffset: { top: 0, left: 0 },
		tapToClose: true,
	};

	constructor(props, context) {
		super(props);
		this.store = context.ruuiStore;
	}

	render() {
		const { wrapperStyle, style, children, ...otherProps } = this.props;

		return <TouchableOpacity
			style={wrapperStyle}
			onPress={this.onPress}
			onLongPress={this.onLongPress}
			{...otherProps}>
			<View
				renderToHardwareTextureAndroid
				style={style}
				ref={(container) => { this.container = container; }}>
				{children}
			</View>
		</TouchableOpacity>;
	}

	onPress = (e) => {
		const { onPress, dropdownEvent } = this.props;
		if (onPress) onPress(e); /* <- call default onPress, so that it'll work as normal */
		if (dropdownEvent === 'onPress') this.toggleDropdown();
	};

	onLongPress = (e) => {
		const { onLongPress, dropdownEvent } = this.props;
		if (onLongPress) onLongPress(e); /* <- call default onLongPress, so that it'll work as normal */
		if (dropdownEvent === 'onLongPress') this.toggleDropdown();
	};

	toggleDropdown = () => {
		const {
			id,
			dropdownWrapperStyle,
			dropdownComponent,
			dropdownDirection,
			animatedDirection,
			dropdownSpacing,
			dropdownOffset,
			dropdownContext,
			showArrow,
			arrowSize,
			arrowOffset,
			containerLayout,
			onClose,
			tapToClose,
			maskPointerEvents,
		} = this.props;

		this.container.measureLayout(findNodeHandle(global.modalsContainer), (a, b, width, height) => {
			this.store.dispatch(appActions.toggleDropdown(true, {
				id: id || `Dropdown_${Math.random()}`,
				wrapperStyle: dropdownWrapperStyle,
				component: dropdownComponent,
				containerLayout: containerLayout || { x: a, y: b, width, height, },
				direction: dropdownDirection,
				animatedDirection: animatedDirection || dropdownDirection,
				spacing: dropdownSpacing,
				offset: dropdownOffset,
				showArrow,
				arrowSize,
				arrowOffset,
				context: dropdownContext,
				onClose,
				tapToClose,
				maskPointerEvents,
			}));
		});
	};
}

export default RuuiDropdownContainer;

const styles = StyleSheet.create({
	container: {

	},
});
