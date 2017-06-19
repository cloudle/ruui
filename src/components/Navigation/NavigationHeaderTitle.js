import React from 'react';
import ReactNative, { Platform, StyleSheet, View, Text } from 'react-native';

type Props = {
	children?: React.Element<any>,
	style?: any,
	textStyle?: any,
	viewProps?: any,
}

const NavigationHeaderTitle = ({ children, style, textStyle, viewProps }: Props) => (
	<View style={[styles.title, style]} {...viewProps}>
		<Text style={[styles.titleText, textStyle]}>{children}</Text>
	</View>
);

const styles = StyleSheet.create({
	title: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		marginHorizontal: 16
	},

	titleText: {
		flex: 1,
		fontSize: 18,
		fontWeight: '500',
		color: 'rgba(0, 0, 0, .9)',
		textAlign: new Set(['ios', 'web']).has(Platform.OS) ? 'center' : 'left'
	}
});

export default NavigationHeaderTitle;
