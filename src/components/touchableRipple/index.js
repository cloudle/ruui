import React from 'react';
import { StyleSheet, View, Text, } from 'react-native';

import { Element, Style, } from '../../typeDefinition';

type Props = {
	style?: Style,
	children?: Element,
	fade?: Boolean,
	raise?: Boolean,
	disabled?: Boolean,
};

function RippleView(props: Props) {
	const { style, children, } = props;
	const flattenStyle = StyleSheet.flatten(style);
	console.log(flattenStyle, '<<- flatten style');

	return <View style={[styles.container, style]}>
		{children}
	</View>;
}

RippleView.defaultProps = {
	fade: false,
	raise: false,
	disabled: false,
};

export default RippleView;

const styles = StyleSheet.create({
	container: {

	},
});
