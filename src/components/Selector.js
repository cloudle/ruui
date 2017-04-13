import React, { Component } from 'react';
import { Animated, TouchableOpacity, ScrollView, View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import ResponsibleTouchArea from './ResponsibleTouchArea';

import { isAndroid, colors } from '../utils';
import { screenWidthPadding } from '../utils/screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
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
				inputRange: [0, 0.32, 1], outputRange: [maxContainerSize, maxContainerSize * 0.15, 0]
			}), containerStyles = {
				transform: [{ translateY }]
			},
			OptionWrapperElement = this.props.configs.options.length > 5 ? ScrollView : View,
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
				<View style={{maxHeight: 255,}}>
					<OptionWrapperElement style={{backgroundColor: '#f9f9f9'}}>
						{this.renderOptions()}
					</OptionWrapperElement>
					{!isAndroid && <View style={styles.optionTails}/>}
				</View>
			</View>
			<View style={styles.commandWrapper}>
				{this.renderCommands()}
			</View>
		</Animated.View>
	}

	renderOptions () {
		const { options } = this.props.configs;

		return options.map((item, i) => {
			let wrapperStyles = {}, iconStyles = {},
				iconName = "radio-button-unchecked";

			if (JSON.stringify(this.props.configs.value) === JSON.stringify(item)) {
				wrapperStyles['backgroundColor'] = '#fcfcfc';
				iconStyles['color'] = colors.iOsBlue;
				iconName = "radio-button-checked";
			}

			return <ResponsibleTouchArea
				key={i} rippleColor={colors.iOsBlue}
				onPress={onItemPick.bind(this, item)}
				wrapperStyle={[styles.optionItemWrapper, wrapperStyles]}
				innerStyle={styles.optionItemInner}
				fadeLevel={0.04}>
				<View style={styles.optionInnerWrapper}>
					<View style={styles.optionIconWrapper}>
						<Icon
							style={[styles.optionIcon, iconStyles]}
							name={iconName}/>
					</View>
					<View style={styles.optionTextWrapper}>
						{this.renderOptionText(item)}
					</View>
				</View>
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
			wrapperStyle={[styles.commandItemWrapper]}
			innerStyle={styles.optionItemInner}
			fadeLevel={0.04}>
			<Text style={styles.commandTitle}>
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

function buildOptionRadius (index, options) {
	return index >= options.length - 1 ? {
		borderBottomLeftRadius: selectorRadius,
		borderBottomRightRadius: selectorRadius,
	} : {};
}

const maxContainerSize = 500,
	selectorRadius = isAndroid ? 3 : 8,
	borderWidth = isAndroid ? 0 : 1,
	selectorMargin = 20,
	selectorPadding = isAndroid ? 20 : 8,
	selectionAlign = isAndroid ? 'left' : 'center';

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
		borderTopLeftRadius: selectorRadius,
		borderTopRightRadius: selectorRadius,
		borderBottomWidth: borderWidth,
		borderColor: '#dedede',
	},
	selectTitleText: {
		padding: selectorPadding,
		paddingTop: 9, paddingBottom: 9,
		textAlign: selectionAlign,
		color: '#8f8f8f', backgroundColor: 'transparent',
		fontSize: 14, fontWeight: '300',
	},
	optionWrapper: {
		margin: selectorMargin,
		marginBottom: isAndroid ? 0 : selectorMargin / 2,
		width: screenWidthPadding(selectorMargin, 400),
	},
	optionInnerWrapper: {
		flexDirection: 'row',
	},
	optionTextWrapper: {
		flex: 1, marginRight: 25,
	},
	optionIconWrapper: {
		width: 20, marginRight: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	optionIcon: {
		color: '#dedede',
		fontSize: 18,
	},
	optionTails: {
		height: selectorRadius,
		backgroundColor: '#f9f9f9',
		borderBottomLeftRadius: selectorRadius,
		borderBottomRightRadius: selectorRadius,
	},
	commandWrapper: {
		margin: selectorMargin,
		marginTop: 0,
		borderRadius: selectorRadius,
		borderTopLeftRadius: isAndroid ? 0 : selectorRadius,
		borderTopRightRadius: isAndroid ? 0 : selectorRadius,
		backgroundColor: isAndroid ? '#f9f9f9' : 'transparent',
		overflow: 'hidden',
		width: screenWidthPadding(selectorMargin, 400)
	},
	optionItemWrapper: {
		backgroundColor: '#f9f9f9',
		borderBottomWidth: borderWidth,
		borderColor: '#dedede',
	},
	optionItemInner: {
		padding: selectorPadding,
		paddingTop: 12, paddingBottom: 12,
	},
	optionTitle: {
		color: colors.iOsBlue,
		fontSize: 17,
		textAlign: selectionAlign,
		backgroundColor: 'transparent',
	},
	commandItemWrapper: {
		flex: 1,
		backgroundColor: '#f5f5f5',
		borderBottomWidth: borderWidth,
		borderColor: '#dedede',
		borderRadius: selectorRadius,
	},
	commandTitle: {
		color: colors.iOsBlue,
		fontSize: 17,
		textAlign: isAndroid ? 'center' : 'center',
		backgroundColor: 'transparent',
	},
});

export default connect(({app}) => {
	return {
		configs: app.selectorConfigs,
	}
})(Selector);