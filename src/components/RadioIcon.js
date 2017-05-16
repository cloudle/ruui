import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { colors } from '../utils';

type Props = {
	active?: boolean,
};

export default class RadioIcon extends Component {
	props: Props;

	render() {
		const wrapperStyle = this.props.active ? {} : {
			borderColor: '#dedede',
		};

		return <View style={[styles.container, wrapperStyle]}>
			{this.props.active ? <View style={styles.inner}/> : <View/>}
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

