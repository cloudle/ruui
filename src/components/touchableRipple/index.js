import React, { useRef, } from 'react';
import { Platform, StyleSheet, View, TouchableOpacity, Text, } from 'react-native';

import { extractBorderRadius, } from './utils';
import { Element, Style, } from '../../typeDefinition';

type Props = {
	style?: Style,
	children?: Element,
	fade?: Boolean,
	raise?: Boolean,
	disabled?: Boolean,
};

function RippleView(props: Props) {
	const { style, children, fade, raise, disabled, ...otherProps } = props;
	const flattenStyle = StyleSheet.flatten(style);
	const radiusStyle = extractBorderRadius(flattenStyle);
	const platformStyle = Platform.select({ web: { cursor: 'pointer', userSelect: 'none' }, });
	const platformProps = Platform.select({
		web: {
			onMouseEnter: () => {

			},
			onMouseLeave: () => {

			},
		},
		default: {},
	});

	return <View
		style={[radiusStyle, platformStyle]}>
		<TouchableOpacity
			style={style}
			disabled={disabled}>
			{children}
		</TouchableOpacity>
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
