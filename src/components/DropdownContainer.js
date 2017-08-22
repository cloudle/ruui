import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import * as appActions from '../utils/store/appAction';
import { Style, Element, SnappingDirection, Layout } from '../typeDefinition';

type Props = {
	dispatch?: Function,
	onPress?: Function,
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

	static defaultProps = {
		dropdownDirection: 'bottom',
		dropdownSpacing: 10,
		offset: { top: 0, left: 0 },
	};

	render() {
		return <TouchableOpacity
			onPress={this.onPress}>
			<View
				style={this.props.style}
				ref={(container) => { this.container = container; }}>
				{this.props.children}
			</View>
		</TouchableOpacity>;
	}

	onPress = (e) => {
		if (this.props.onPress) this.props.onPress(e);
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