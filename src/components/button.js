import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import ResponsibleTouchArea from './responsibleTouchArea';
import { colors, valueAt } from '../utils';
import type { Style, Element, SnappingDirection, } from '../typeDefinition';

type Props = {
	title?: String,
	icon?: Element,
	rightIcon?: Element,
	children?: Element,
	wrapperStyle?: Style,
	innerStyle?: Style,
	textStyle?: Style,
	tooltip?: String | Element,
	tooltipWrapperStyle?: Style,
	tooltipDirection?: SnappingDirection,
	tooltipPositionSpacing?: number,
	tooltipPositionOffset?: Object,
	ripple?: boolean,
	staticRipple?: boolean,
	rippleColor?: string,
	rippleInitialOpacity?: number,
	rippleInitialScale?: number,
	rippleAnimationSpeed?: number,
	fade?: boolean,
	fadeLevel?: number,
	raise?: boolean,
	debounce?: number,
	disabled?: boolean,
	activeOpacity?: number,
	onPress?: Function,
	onPressIn?: Function,
	onPressOut?: Function,
	onMouseEnter?: Function,
	onMouseLeave?: Function,
};

export default class RuuiButton extends Component<any, Props, any> {
	props: Props;

	static contextTypes = {
		ruuiConfigs: PropTypes.object,
	};

	static defaultProps = {
		ripple: true,
		staticRipple: false,
		title: 'TITLE',
		disabled: false,
		raise: true,
		fade: true,
		fadeLevel: 0.2,
	};

	render() {
		const { wrapperStyle, innerStyle, ...otherProps } = this.props,
			ruuiStyles = valueAt(this, 'context.ruuiConfigs.button.styles', styles);

		return <ResponsibleTouchArea
			wrapperStyle={[ruuiStyles.wrapper, wrapperStyle]}
			innerStyle={[ruuiStyles.contentContainer, innerStyle]}
			{...otherProps}>
			{this.renderContent()}
		</ResponsibleTouchArea>;
	}

	renderContent() {
		const { title, textStyle, icon, rightIcon, children } = this.props,
			ruuiStyles = valueAt(this, 'context.ruuiConfigs.button.styles', styles),
			textStyles = [ruuiStyles.titleText, textStyle];

		if (children) {
			return children;
		} else {
			return <View style={ruuiStyles.innerContainer}>
				<View style={ruuiStyles.leftContainer}>{icon}</View>
				<Text style={textStyles}>{title}</Text>
				<View style={ruuiStyles.rightContainer}>{rightIcon}</View>
			</View>;
		}
	}
}

export const styles = StyleSheet.create({
	wrapper: {
		backgroundColor: colors.iOsBlue,
		borderRadius: 3,
	},
	contentContainer: {
		padding: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	innerContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	leftContainer: {
		marginRight: 6,
	},
	rightContainer: {
		marginLeft: 6,
	},
	titleText: {
		color: '#FFFFFF',
		backgroundColor: 'transparent',
	},
});
