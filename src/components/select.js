import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';

import { base64Icons, } from '../utils';
import { Style } from '../typeDefinition';
import * as appAction from '../utils/store/appAction';

type Props = {
	floatingLabel?: string,
	cancelText?: string,
	options?: Array<any>,
	value?: any,
	getTitle?: Function,
	onSelect?: Function,
	onChange?: Function,
	onCancel?: Function,
	iconSource?: any,
	iconStyle?: Style,
	tapToClose?: boolean,
};

export default class RuuiSelect extends Component<any, Props, any> {
	static props: Props;
	static contextTypes = {
		ruuiStore: PropTypes.object,
	};

	static defaultProps = {
		floatingLabel: 'Select',
		cancelText: 'Cancel',
		options: [{ title: 'Missing options param' }],
		tapToClose: true,
	};

	constructor(props, context) {
		super(props);
		this.store = context.ruuiStore;
	}

	render() {
		const iconSource = this.props.iconSource || { uri: base64Icons.downArrow };

		return <TouchableOpacity
			onPress={this.activateSelector}
			style={styles.container}
			activeOpacity={0.8}>
			<View style={styles.contentWrapper}>
				<Text style={styles.floatingLabel}>{this.props.floatingLabel}</Text>
				{this.renderValue()}
			</View>
			<View style={styles.iconWrapper}>
				<Image
					style={[styles.downIcon, this.props.iconStyle]}
					resizeMode={Image.resizeMode.contain}
					source={iconSource}/>
			</View>
		</TouchableOpacity>;
	}

	renderValue() {
		let valueText = this.props.value && (this.props.value.title || 'Missing value option');
		if (this.props.getTitle) valueText = this.props.getTitle(this.props.value);

		return <Text style={styles.valueText}>
			{valueText}
		</Text>;
	}

	activateSelector = () => {
		this.store.dispatch(appAction.toggleSelector(true, {
			selectText: this.props.floatingLabel,
			cancelText: this.props.cancelText,
			options: this.props.options,
			activeOption: this.props.value,
			getTitle: this.props.getTitle,
			onSelect: this.props.onSelect,
			onChange: this.props.onChange,
			onCancel: this.props.onCancel,
			value: this.props.value,
			tapToClose: this.props.tapToClose,
		}));
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderColor: '#f5f5f5',
	},
	contentWrapper: {
		flex: 1,
	},
	floatingLabel: {
		color: '#888888',
		fontSize: 12,
		paddingLeft: 8, paddingRight: 8,
		paddingTop: 5,
	},
	valueText: {
		padding: 8,
		paddingTop: 8, paddingBottom: 5,
		color: '#444444',
		fontSize: 16,
	},
	iconWrapper: {
		width: 50,
		justifyContent: 'center',
		alignItems: 'center',
	},
	downIcon: {
		width: 16, height: 16,
	},
});