import React, { Component } from 'react';
import { Animated, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import ResponsibleTouchArea from './ResponsibleTouchArea';

import { colors } from '../utils';
import { ScreenWidthPadding } from '../utils/screen';
import * as appActions from '../utils/store/appAction';

@connect(({app}) => {
	return {

	}
})

export default class Selector extends Component {
	constructor (props) {
	  super(props);
	  this.state = {
	    lock: false,
	  }
	}

	static propTypes = {
		configs: React.PropTypes.object,
	};

	render () {
		const translateY = this.props.animation.interpolate({
				inputRange: [0, 0.2, 1], outputRange: [maxContainerSize, maxContainerSize * 0.15, 0]
			}), containerStyles = {
				transform: [{ translateY }]
			},
			pointerEvents = this.state.lock ? 'none' : 'auto';

		return <Animated.View
			pointerEvents={pointerEvents}
			style={[styles.container, containerStyles]}>
			<View style={styles.optionWrapper}>
				<View style={styles.selectTitle}>
					<Text style={styles.selectTitleText}>
						Select
					</Text>
				</View>
				{this.renderOptions()}
			</View>
			<View style={styles.commandWrapper}>
				{this.renderCommands()}
			</View>
		</Animated.View>
	}

	renderOptions () {
		const { options } = this.props.configs;
		return options.map((item, i) => {
			const wrapperRadius = buildSelectionRadius(options, i);

			return <ResponsibleTouchArea
				key={i} rippleColor={colors.iOsBlue}
				wrapperStyle={[styles.optionItemWrapper, wrapperRadius]}
				innerStyle={styles.optionItemInner}
				fadeLevel={0.04}>
				<Text style={styles.optionTitle}>
					{item.title}
				</Text>
			</ResponsibleTouchArea>
		});
	}

	renderCommands () {
		return <ResponsibleTouchArea
			onPress={this::cancelSelector}
			rippleColor={colors.iOsBlue}
			wrapperStyle={[styles.optionItemWrapper, {borderRadius: 8}]}
			innerStyle={styles.optionItemInner}
			fadeLevel={0.04}>
			<Text style={styles.optionTitle}>
				{this.props.configs.cancelText}
			</Text>
		</ResponsibleTouchArea>
	}
}

function cancelSelector () {
	this.setState({lock: true});
	this.props.dispatch(appActions.toggleSelector(false));
}

function buildSelectionRadius (options, index) {
	const result = {};

	if (index == options.length - 1) {
		result['borderBottomLeftRadius'] = 8;
		result['borderBottomRightRadius'] = 8;
	}

	return result;
}

const maxContainerSize = 500;
const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		bottom: 0, left: 0, right: 0,
		maxHeight: maxContainerSize,
		alignItems: 'center',
	},
	selectTitle: {
		flex: 1,
		backgroundColor: '#f9f9f9',
		borderTopLeftRadius: 8,
		borderTopRightRadius: 8,
		borderBottomWidth: 1,
		borderColor: '#dedede',
	},
	selectTitleText: {
		padding: 8,
		paddingTop: 9, paddingBottom: 9,
		textAlign: 'center',
		color: '#8f8f8f',
		fontSize: 14, fontWeight: '300',
	},
	optionWrapper: {
		margin: 20,
		marginBottom: 10,
		borderRadius: 8,
		overflow: 'hidden',
		width: ScreenWidthPadding(20, 400)
	},
	commandWrapper: {
		margin: 20,
		marginTop: 0,
		width: ScreenWidthPadding(20, 400)
	},
	optionItemWrapper: {
		flex: 1,
		backgroundColor: '#f9f9f9',
		borderBottomWidth: 1,
		borderColor: '#dedede',
	},
	optionItemInner: {
		padding: 8,
		paddingTop: 12, paddingBottom: 12,
	},
	optionTitle: {
		color: colors.iOsBlue,
		fontSize: 17,
		textAlign: 'center',
		backgroundColor: 'transparent',
	}
});