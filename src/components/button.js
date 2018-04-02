import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet } from 'react-native';
import ResponsibleTouchArea from './ResponsibleTouchArea';
import { colors } from '../utils';
import type {
	Style,
	Element,
	SnappingDirection,
	AccessibilityComponentType,
	AccessibilityTrait,
	Corners,
} from '../typeDefinition';

type Props = {
	id?: String,
	nativeID?: String,
	testID?: String,
	accessible?: Boolean,
	accessibilityLabel?: any,
	accessibilityComponentType?: AccessibilityComponentType,
	accessibilityTraits?: AccessibilityTrait,
	onAccessibilityTap?: Function,
	onMagicTap?: Function,
	wrapperStyle?: Style,
	innerStyle?: Style,
	color?: String,
	borderRadius?: Number,
	ripple?: Boolean,
	rippleColor?: String,
	rippleInitialOpacity?: Number,
	rippleInitialScale?: Number,
	staticRipple?: Boolean,
	icon?: Element,
	rightIcon?: Element,
	title?: String,
	tooltip?: String | Element,
	tooltipDirection?: SnappingDirection,
	tooltipPositionSpacing?: Number,
	tooltipPositionOffset?: Object,
	textStyle?: Style,
	disabled?: Boolean,
	raise?: Boolean,
	fade?: Boolean,
	onPress?: Function,
	onPressIn?: Function,
	onPressOut?: Function,
	onLongPress?: Function,
	delayPressIn?: Number,
	delayPressOut?: Number,
	delayLongPress?: Number,
	hitSlop?: Corners,
	pressRetentionOffset?: Corners,
	onLayout?: Function,
	fadeLevel?: Number,
	children?: Element,
};

export default class Button extends Component<any, Props, any> {
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
		const styles = this.context.ruuiConfigs.button.styles || styles;

		return <ResponsibleTouchArea
			id={this.props.id}
			nativeID={this.props.nativeID}
			testID={this.props.testID}
			accessible={this.props.accessible}
			accessibilityLabel={this.props.accessibilityLabel}
			accessibilityComponentType={this.props.accessibilityComponentType}
			accessibilityTraits={this.props.accessibilityTraits}
			onAccessibilityTap={this.props.onAccessibilityTap}
			onMagicTap={this.props.onMagicTap}
			onPress={this.props.onPress}
			onPressIn={this.props.onPressIn}
			onPressOut={this.props.onPressOut}
			onLongPress={this.props.onLongPress}
			delayPressIn={this.props.delayPressIn}
			delayPressOut={this.props.delayPressOut}
			delayLongPress={this.props.delayLongPress}
			hitSlop={this.props.hitSlop}
			pressRetentionOffset={this.props.pressRetentionOffset}
			onLayout={this.props.onLayout}
			ripple={this.props.ripple}
			staticRipple={this.props.staticRipple}
			rippleColor={this.props.rippleColor}
			rippleInitialOpacity={this.props.rippleInitialOpacity}
			rippleInitialScale={this.props.rippleInitialScale}
			disabled={this.props.disabled}
			raise={this.props.raise}
			fade={this.props.fade}
			fadeLevel={this.props.fadeLevel}
			tooltip={this.props.tooltip}
			tooltipDirection={this.props.tooltipDirection}
			tooltipPositionSpacing={this.props.tooltipPositionSpacing}
			tooltipPositionOffset={this.props.tooltipPositionOffset}
			wrapperStyle={[styles.wrapper, this.props.wrapperStyle]}
			innerStyle={[styles.contentContainer, this.props.innerStyle]}>
			{this.renderContent()}
		</ResponsibleTouchArea>;
	}

	renderContent() {
		const styles = this.context.ruuiConfigs.button.styles || styles,
			title = this.props.title,
			textStyles = [styles.titleText, this.props.textStyle];

		if (this.props.children) {
			return this.props.children;
		} else {
			return <View style={styles.innerContainer}>
				<View style={styles.leftContainer}>{this.props.icon}</View>
				<Text style={textStyles}>{title}</Text>
				<View style={styles.rightContainer}>{this.props.rightIcon}</View>
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