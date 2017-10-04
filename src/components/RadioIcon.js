import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { colors } from '../utils';

type Props = {
	active?: boolean,
	color?: string,
};

export default class RadioIcon extends Component {
	props: Props;

	static defaultProps = {
		color: colors.iOsBlue,
	};

	render() {
		const wrapperStyle = {
				borderColor: this.props.active ? this.props.color : '#dedede',
			}, innerStyle = {
				backgroundColor: this.props.color,
			};

		return <View style={[styles.container, wrapperStyle]}>
			{this.props.active ? <View style={[styles.inner, innerStyle]}/> : <View/>}
		</View>;
	}
}

const styles = StyleSheet.create({
	container: {
		width: 16, height: 16,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: colors.iOsBlue,
		justifyContent: 'center',
		alignItems: 'center',
	},
	inner: {
		backgroundColor: colors.iOsBlue,
		borderColor: '#ffffff',
		borderWidth: 1.5,
		width: 12, height: 12,
		borderRadius: 7,
	},
});

