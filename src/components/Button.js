import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ResponsibleTouchArea from './ResponsibleTouchArea';
import { colors } from '../utils';

export default class Button extends Component {
	static propTypes = {
		wrapperStyle: React.PropTypes.any,
		innerStyle: React.PropTypes.object,
		color: React.PropTypes.string,
		borderRadius: React.PropTypes.number,
		ripple: React.PropTypes.bool,
		rippleColor: React.PropTypes.string,
		rippleInitialOpacity: React.PropTypes.number,
		rippleInitialScale: React.PropTypes.number,
		staticRipple: React.PropTypes.bool,
		icon: React.PropTypes.any,
		rightIcon: React.PropTypes.bool,
		title: React.PropTypes.string,
		tooltip: React.PropTypes.string,
		textStyle: React.PropTypes.object,
		disabled: React.PropTypes.bool,
		raise: React.PropTypes.bool,
		fade: React.PropTypes.bool,
		onPress: React.PropTypes.func,
		fadeLevel: React.PropTypes.number,
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

  render () {
    return <ResponsibleTouchArea
	    onPress={this.props.onPress}
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
	    wrapperStyle={[styles.wrapper, this.props.wrapperStyle]}
      innerStyle={[styles.contentContainer, this.props.innerStyle]}>
	    {this.renderContent()}
    </ResponsibleTouchArea>
  }

  renderContent () {
		let title = this.props.title,
			icon = this.props.icon,
			textStyles = [styles.titleText, this.props.textStyle];

  	if (this.props.children) {
		  return this.props.children;
	  } else if (this.props.rightIcon) {
  		return <Text style={textStyles}>
			  {title} {icon}
		  </Text>
	  } else {
		  return <Text style={textStyles}>
			  {icon} {title}
		  </Text>
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
		alignItems: 'center',
		justifyContent: 'center',
	},
	titleText: {
		color: '#FFFFFF',
		backgroundColor: 'transparent',
	},
});