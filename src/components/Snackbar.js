import React, { Component } from 'react';
import { Animated, Easing, View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import { horizontalSnappings } from '../utils';

const snackbarRadius = 3;

@connect(({app}) => {
	return {

	}
})

export default class Snackbar extends Component {
	static propTypes = {
		contentRenderer: React.PropTypes.func,
		containerStyle: React.PropTypes.any,
		minWidth: React.PropTypes.number,
		margin: React.PropTypes.number,
	};

	static defaultProps = {
		contentRenderer: defaultContentRenderer,
		minWidth: 300,
		margin: 15,
	};

	constructor (props) {
	  super(props);
	  this.state = {
		  enterAnimation: new Animated.Value(0),
	  }
	}

  render () {
  	const snappingStyles = horizontalSnappings(this.props.margin, this.props.minWidth);

  	return <View
	    style={[styles.container, this.props.containerStyle, snappingStyles]}>
		  {this.props.contentRenderer()}
    </View>
  }
}

function defaultContentRenderer () {
	return <Text style={styles.message}>Snackbar</Text>
}

function playEnterAnimation () {
	if (this.enterAnimation) this.enterAnimation.clear();

	this.enterAnimation = Animated.timing(this.state.enterAnimation, {
		toValue: 1,
		duration: 800,
		easing: Easing.in(Easing.bezier(0, .48, .35, 1)),
	});
}

function playLeaveAnimation () {

}

const styles = StyleSheet.create({
  container: {
  	position: 'absolute', bottom: 0,
	  padding: 14,
  	borderTopLeftRadius: snackbarRadius, borderTopRightRadius: snackbarRadius,
	  backgroundColor: 'rgba(20, 20 , 20, 0.8)',
  },
	message: {
  	color: '#ffffff',
	}
});