import React, { Component } from 'react';
import { TouchableOpacity, Image, View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { appAction } from '../../src/utils';

const arrowDownImage = require('./arrow-down.png');

@connect(({ app }) => {
	return {

	};
})

export default class Select extends Component {
	static propTypes = {
		floatingLabel: React.PropTypes.string,
		cancelText: React.PropTypes.string,
		options: React.PropTypes.array,
		value: React.PropTypes.any,
		getTitle: React.PropTypes.func,
		onSelect: React.PropTypes.func,
		onChange: React.PropTypes.func,
		onCancel: React.PropTypes.func,
		dispatch: React.PropTypes.func,
	};

	static defaultProps = {
		floatingLabel: 'Select',
		cancelText: 'Cancel',
		options: [{ title: 'Missing options param' }],
	};

	render() {
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
					style={styles.downIcon}
					resizeMode={Image.resizeMode.contain}
					source={arrowDownImage}/>
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
		this.props.dispatch(appAction.toggleSelector(true, {
			selectText: this.props.floatingLabel,
			cancelText: this.props.cancelText,
			options: this.props.options,
			activeOption: this.props.value,
			getTitle: this.props.getTitle,
			onSelect: this.props.onSelect,
			onChange: this.props.onChange,
			onCancel: this.props.onCancel,
			value: this.props.value,
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