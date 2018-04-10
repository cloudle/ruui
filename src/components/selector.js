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

export default class Selector extends Component<any, Props, any> {
	static props: Props;
	static contextTypes = {
		ruuiStore: PropTypes.object,
	};

	constructor(props, context) {
		super(props);
		this.store = context.ruuiStore;
	}

	render() {
		const translateY = this.props.animation.interpolate({
				inputRange: [0, 0.32, 1], outputRange: [maxContainerSize, maxContainerSize * 0.15, 0],
			}), selectionContainerStyles = {
				transform: [{ translateY }],
			},
			OptionWrapperElement = this.props.configs.options.length > 5 ? ScrollView : View,
			pointerEvents = this.props.active ? 'auto' : 'none';

		return <View pointerEvents={pointerEvents} style={styles.container}>
			{this.props.configs.tapToClose ? <TouchableWithoutFeedback
				onPress={() => this.props.onRequestClose(this.props.configs)}>
				<View style={styles.touchableMask}/>
			</TouchableWithoutFeedback> : <View/>}

			<Animated.View
				style={[styles.selectionContainer, selectionContainerStyles]}>
				<View style={styles.optionWrapper}>
					<View style={styles.selectTitle}>
						<Text style={styles.selectTitleText}>
							{this.props.configs.selectText}
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
		const options = this.props.configs.options || [];
		return options.map((item, i) => {
			return <SelectorItem
				key={i}
				optionInstance={item}
				activeInstance={this.props.configs.value}
				getTitle={this.props.configs.getTitle}
				onPress={this.onItemPick}/>;
		});
	}

	renderCommands() {
		return <ResponsibleTouchArea
			onPress={this.cancelSelector}
			rippleColor={colors.iOsBlue}
			wrapperStyle={[styles.commandItemWrapper]}
			innerStyle={styles.optionItemInner}
			fadeLevel={0.04}>
			<Text style={styles.commandTitle}>
				{this.props.configs.cancelText}
			</Text>
		</ResponsibleTouchArea>;
	}

	onItemPick = (item) => {
		this.store.dispatch(appActions.toggleSelector(false));

		if (this.props.configs.onSelect) this.props.configs.onSelect(item);
		if (this.props.configs.onChange
			&& JSON.stringify(this.props.configs.value) !== JSON.stringify(item)) {
			this.props.configs.onChange(item);
		}
	};

	cancelSelector = () => {
		this.store.dispatch(appActions.toggleSelector(false, {
			id: this.props.configs.id,
		}));
		if (this.props.configs.onCancel) this.props.configs.onCancel();
	}
}

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