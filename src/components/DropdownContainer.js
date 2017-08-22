import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import * as appActions from '../utils/store/appAction';
import { Style, Element } from '../typeDefinition';

type Props = {
	dispatch?: Function,
	onPress?: Function,
	style?: Style,
	children?: Element,
	dropdownComponent?: any,
	dropdownWrapperStyle?: Style,
	dropdownContext?: Object,
};

@connect(({ app }) => {
	return {

	};
})

export default class DropdownContainer extends Component {
	props: Props;

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
				context: this.props.dropdownContext,
				position: { top: py + height, left: px, },
			}));
		});
	};
}

const styles = StyleSheet.create({
	container: {

	},
});