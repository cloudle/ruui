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
		title: React.PropTypes.string,
		textStyle: React.PropTypes.object,
		raise: React.PropTypes.bool,
	};

	static defaultProps = {
		staticRipple: false,
		rippleColor: '#FFFFFF',
		title: 'Title',
	};

  render () {
    return <ResponsibleTouchArea
	    staticRipple={this.props.staticRipple}
	    rippleColor={this.props.rippleColor}
	    wrapperStyle={[styles.wrapper, this.props.wrapperStyle]}
      innerStyle={[styles.contentContainer, this.props.innerStyle]}>
	    {this.renderContent()}
    </ResponsibleTouchArea>
  }

  renderContent () {
  	if (this.props.children) {
		  return this.props.children;
	  } else {
  		return <Text style={[styles.titleText, this.props.textStyle]}>
			  {this.props.title}
		  </Text>
	  }
  }
}

const styles = StyleSheet.create({
	wrapper: {
		backgroundColor: colors.sky,
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