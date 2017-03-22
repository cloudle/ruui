import React, { Component } from 'react';
import { Animated, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import ResponsibleTouchArea from './ResponsibleTouchArea';

import { colors } from '../utils';
import { screenWidthPadding } from '../utils/screen';
import * as appActions from '../utils/store/appAction';

class Selector extends Component {
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
						{this.props.configs.selectText}
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
			let wrapperStyles = buildSelectionRadius(options, i);

			if (JSON.stringify(this.props.configs.value) === JSON.stringify(item)) {
				wrapperStyles['backgroundColor'] = '#FFFFFF';
			}

			return <ResponsibleTouchArea
				key={i} rippleColor={colors.iOsBlue}
				onPress={onItemPick.bind(this, item)}
				wrapperStyle={[styles.optionItemWrapper, wrapperStyles]}
				innerStyle={styles.optionItemInner}
				fadeLevel={0.04}>
				{this.renderOptionText(item)}
			</ResponsibleTouchArea>
		});
	}

	renderOptionText (item) {
		let optionText = item.title;
		if (this.props.configs.getTitle) optionText = this.props.configs.getTitle(item);

		return <Text style={styles.optionTitle}>
			{optionText}
		</Text>
	}

	renderCommands () {
		return <ResponsibleTouchArea
			onPress={cancelSelector.bind(this)}
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

function onItemPick (instance) {
	this.setState({lock: true});
	this.props.dispatch(appActions.toggleSelector(false));

	this.props.configs.onSelect && this.props.configs.onSelect(instance);
	if (JSON.stringify(this.props.configs.value) !== JSON.stringify(instance)) {
		this.props.configs.onChange && this.props.configs.onChange(instance);
	}
}

function cancelSelector () {
	this.setState({lock: true});
	this.props.dispatch(appActions.toggleSelector(false));
	this.props.configs.onCancel && this.props.configs.onCancel();
}

function buildSelectionRadius (options, index) {
	const result = {};

	if (index === options.length - 1) {
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
		width: screenWidthPadding(20, 400)
	},
	commandWrapper: {
		margin: 20,
		marginTop: 0,
		width: screenWidthPadding(20, 400)
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

export default connect(({app}) => {
	return {
		configs: app.selectorConfigs,
	}
})(Selector);