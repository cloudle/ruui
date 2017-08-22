import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ResponsibleTouchArea from './ResponsibleTouchArea';
import { colors } from '../utils';
import { Style, Element, SnappingDirection } from '../typeDefinition';

type Props = {
	wrapperStyle?: Style,
	innerStyle?: Style,
	color?: string,
	borderRadius?: number,
	ripple?: boolean,
	rippleColor?: string,
	rippleInitialOpacity?: number,
	rippleInitialScale?: number,
	staticRipple?: boolean,
	icon?: Element,
	rightIcon?: Element,
	title?: string,
	tooltip?: string | Element,
	tooltipDirection?: SnappingDirection,
	tooltipPositionSpacing?: number,
	tooltipPositionOffset?: Object,
	textStyle?: Style,
	disabled?: boolean,
	raise?: boolean,
	fade?: boolean,
	onPress?: Function,
	onLongPress?: Function,
	fadeLevel?: number,
	children?: Element,
};

export default class Button extends Component<any, Props, any> {
	props: Props;

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
		return <ResponsibleTouchArea
			onPress={this.props.onPress}
			onLongPress={this.props.onLongPress}
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
		const title = this.props.title,
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

const styles = StyleSheet.create({
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