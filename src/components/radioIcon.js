import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { colors } from '../utils';

type Props = {
	active?: boolean,
	color?: string,
};

class RuuiRadioIcon extends Component {
	props: Props;

	static defaultProps = {
		color: colors.iOsBlue,
	};

	render() {
		const { active, color } = this.props,
			wrapperStyle = { borderColor: active ? color : '#dedede', },
			innerStyle = { backgroundColor: color, };

		return <View style={[styles.container, wrapperStyle]}>
			{active ? <View style={[styles.inner, innerStyle]}/> : <View/>}
		</View>;
	}
}

export default RuuiRadioIcon;

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
