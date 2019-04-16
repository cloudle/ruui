import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, TouchableWithoutFeedback, ScrollView, View, Text, StyleSheet } from 'react-native';

import ResponsibleTouchArea from './responsibleTouchArea';
import SelectorItem from './selectorItem';
import { isAndroid, colors } from '../utils';
import { screenWidthPadding } from '../utils/screen';
import * as appActions from '../utils/store/appAction';

type Props = {
	configs?: Object,
	animation?: any,
	active?: boolean,
	dispatch?: Function,
	onRequestClose?: Function,
};

class Selector extends Component<any, Props, any> {
	static props: Props;

	static contextTypes = {
		ruuiStore: PropTypes.object,
	};

	constructor(props, context) {
		super(props);
		this.store = context.ruuiStore;
	}

	render() {
		const { animation, configs, active, onRequestClose } = this.props,
			translateY = animation.interpolate({
				inputRange: [0, 0.32, 1], outputRange: [maxContainerSize, maxContainerSize * 0.15, 0],
			}), selectionContainerStyles = {
				transform: [{ translateY }],
			},
			OptionWrapperElement = configs.options.length > 5 ? ScrollView : View,
			pointerEvents = active ? 'auto' : 'none';

		return <View pointerEvents={pointerEvents} style={styles.container}>
			{configs.tapToClose ? <TouchableWithoutFeedback
				onPress={() => onRequestClose(configs)}>
				<View style={styles.touchableMask}/>
			</TouchableWithoutFeedback> : <View/>}

			<Animated.View
				style={[styles.selectionContainer, selectionContainerStyles]}>
				<View style={styles.optionWrapper}>
					<View style={styles.selectTitle}>
						<Text style={styles.selectTitleText}>
							{configs.selectText}
						</Text>
					</View>
					<View style={{ maxHeight: 255 }}>
						<OptionWrapperElement style={{ backgroundColor: '#f9f9f9' }}>
							{this.renderOptions()}
						</OptionWrapperElement>
						{!isAndroid && <View style={styles.optionTails}/>}
					</View>
				</View>
				<View style={styles.commandWrapper}>
					{this.renderCommands()}
				</View>
			</Animated.View>
		</View>;
	}

	renderOptions() {
		const { configs } = this.props,
			{ options = [] } = configs;

		return options.map((item, i) => {
			return <SelectorItem
				key={i}
				optionInstance={item}
				activeInstance={configs.value}
				getTitle={configs.getTitle}
				onPress={this.onItemPick}/>;
		});
	}

	renderCommands() {
		const { configs } = this.props;

		return <ResponsibleTouchArea
			onPress={this.cancelSelector}
			rippleColor={colors.iOsBlue}
			wrapperStyle={[styles.commandItemWrapper]}
			innerStyle={styles.optionItemInner}
			fadeLevel={0.04}>
			<Text style={styles.commandTitle}>
				{configs.cancelText}
			</Text>
		</ResponsibleTouchArea>;
	}

	onItemPick = (item) => {
		const { configs } = this.props;

		this.store.dispatch(appActions.toggleSelector(false));
		if (configs.onSelect) configs.onSelect(item);
		if (configs.onChange
			&& JSON.stringify(configs.value) !== JSON.stringify(item)) {
			configs.onChange(item);
		}
	};

	cancelSelector = () => {
		const { configs } = this.props;

		this.store.dispatch(appActions.toggleSelector(false, {
			id: configs.id,
		}));
		if (configs.onCancel) configs.onCancel();
	}
}

export default Selector;

const maxContainerSize = 500,
	selectorRadius = isAndroid ? 3 : 8,
	borderWidth = isAndroid ? 0 : 1,
	selectorMargin = 20,
	selectorPadding = isAndroid ? 20 : 8,
	selectionAlign = isAndroid ? 'left' : 'center';

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	selectionContainer: {
		position: 'absolute',
		bottom: 0, left: 0, right: 0,
		maxHeight: maxContainerSize,
		alignItems: 'center',
	},
	touchableMask: {
		position: 'absolute',
		top: 0, right: 0, left: 0, bottom: 0,
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
	optionItemInner: {
		padding: selectorPadding,
		paddingTop: 12, paddingBottom: 12,
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
		width: screenWidthPadding(selectorMargin, 400),
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
