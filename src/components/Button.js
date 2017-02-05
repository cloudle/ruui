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
		rippleColor: React.PropTypes.string,
		staticRipple: React.PropTypes.bool,
		icon: React.PropTypes.any,
		rightIcon: React.PropTypes.bool,
		title: React.PropTypes.string,
		textStyle: React.PropTypes.object,
		raise: React.PropTypes.bool,
		onPress: React.PropTypes.func,
	};

	static defaultProps = {
		staticRipple: false,
		rippleColor: '#FFFFFF',
		title: 'Title',
	};

  render () {
    return <ResponsibleTouchArea
	    onPress={this.props.onPress}
	    raise={true}
	    staticRipple={this.props.staticRipple}
	    rippleColor={this.props.rippleColor}
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
		backgroundColor: colors.sky,
		borderRadius: 3,
		margin: 20
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