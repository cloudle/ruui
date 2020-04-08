import React, { useContext, useRef, } from 'react';
import { Platform, StyleSheet, View, TouchableOpacity, Text, } from 'react-native';

import Ripple from './ripple';
import { extractWrapperStyle, useRipple, } from './utils';
import { RuuiContext, } from '../../utils/context';
import { Element, Style, } from '../../typeDefinition';

type Props = {
	style?: Style,
	children?: Element,
	staticRipple?: Boolean,
	fade?: Boolean,
	raise?: Boolean,
	disabled?: Boolean,
};

function RippleView(props: Props) {
	const { style, children, staticRipple, fade, raise, disabled, ...otherProps } = props;
	const containerRef = useRef();
	const ruuiStore = useContext(RuuiContext);
	const flattenStyle = StyleSheet.flatten(style) || {};
	const wrapperStyle = extractWrapperStyle(flattenStyle);
	const [onPressIn, onAnimationComplete, ripples] = useRipple(5, staticRipple, flattenStyle);
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
		ref={containerRef}
		style={[wrapperStyle, platformStyle]}>
		<View style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
			{ripples.map((ripple) => <Ripple
				key={ripple.id}
				id={ripple.id}
				style={ripple.style}
				onAnimationComplete={onAnimationComplete}/>)}
		</View>
		<TouchableOpacity
			activeOpacity={1}
			style={[style, { backgroundColor: 'transparent' }]}
			disabled={disabled}
			onPressIn={e => onPressIn(containerRef, e)}>
			<View pointerEvents="none">
				{children}
			</View>
		</TouchableOpacity>
	</View>;
}

RippleView.defaultProps = {
	fade: false,
	raise: false,
	disabled: false,
	staticRipple: false,
};

export default RippleView;

const styles = StyleSheet.create({
	container: {

	},
});
