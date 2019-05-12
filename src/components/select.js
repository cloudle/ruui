import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';

import { base64Icons, } from '../utils';
import { Style } from '../typeDefinition';
import * as appAction from '../utils/store/appAction';

const defaultIcon = { uri: base64Icons.downArrow };
const defaultTitleGet = item => item && item.title;

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
		getTitle: defaultTitleGet,
	};

	constructor(props, context) {
		super(props);
		this.store = context.ruuiStore;
	}

	render() {
		const { iconSource = defaultIcon, floatingLabel, iconStyle } = this.props;

		return <TouchableOpacity
			onPress={this.activateSelector}
			style={styles.container}
			activeOpacity={0.8}>
			<View style={styles.contentWrapper}>
				<Text style={styles.floatingLabel}>{floatingLabel}</Text>
				{this.renderValue()}
			</View>
			<View style={styles.iconWrapper}>
				<Image
					style={[styles.downIcon, iconStyle]}
					resizeMode="contain"
					source={iconSource}/>
			</View>
		</TouchableOpacity>;
	}

	renderValue() {
		const { value, getTitle, } = this.props,
			valueText = getTitle(value) || 'Missing value option';

		return <Text style={styles.valueText}>{valueText}</Text>;
	}

	activateSelector = () => {
		const { floatingLabel, value, ...otherProps } = this.props;

		this.store.dispatch(appAction.toggleSelector(true, {
			selectText: floatingLabel,
			activeOption: value,
			value,
			...otherProps
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
