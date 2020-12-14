import React, { Component } from 'react';
import { Animated, Easing, View, TouchableWithoutFeedback, Text, StyleSheet } from 'react-native';
import { Svg, Path, } from 'react-native-svg';

import { directionSnap, arrowSnap, directionAnimatedConfigs, connect } from '../utils';
import * as appActions from '../utils/store/appAction';
import { DropdownConfigs } from '../typeDefinition';

type Props = {
	dispatch?: Function,
	active?: boolean,
	configs?: DropdownConfigs,
	screenSize?: { width?: number, height?: number },
};

class RuuiDropdown extends Component {
	props: Props;

	constructor(props) {
		super(props);
		this.enterAnimation = new Animated.Value(0);
		this.state = {
			layout: {},
		};
	}

	componentDidMount() {
		this.playAnimation();
	}

	componentWillUnmount() {
		const { configs: { onClose } } = this.props;
		if (onClose) onClose();
	}

	playAnimation = () => {
		this.enterAnimation.setValue(0);
		Animated.timing(this.enterAnimation, {
			toValue: 1,
			duration: 800,
			easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
			useNativeDriver: false,
		}).start();
	}

	componentDidUpdate(prevProps) {
		const { active } = this.props;
		if (prevProps.active !== active && active) {
			this.playAnimation();
		}
	}

	render() {
		const { active, configs } = this.props;

		return active ? <View style={styles.container}>
			{configs.tapToClose ? <TouchableWithoutFeedback
				onPress={this.closeModal}>
				<View style={styles.touchableMask}/>
			</TouchableWithoutFeedback> : <View/>}
			{this.renderDropDown()}
		</View> : <View/>;
	}

	renderDropDown() {
		const { configs, screenSize } = this.props;
		const { layout, } = this.state;
		const context = configs.context || {};
		const positionOffset = configs.offset || { top: 0, left: 0 };
		const arrowOffset = configs.arrowOffset || { top: 0, left: 0 };
		const containerLayout = configs.containerLayout || { x: 0, y: 0, width: 0, height: 0 };
		const InnerComponent = configs.component || configs.Component || EmptyDropdown;
		const arrowSize = configs.arrowSize || 8;
		const flattenWrapperStyle = StyleSheet.flatten(configs.wrapperStyle) || {};
		const backgroundColor = flattenWrapperStyle.backgroundColor || '#ffffff';
		const finalBorderRadius = flattenWrapperStyle.borderRadius || 3;
		const animatedDirection = configs.animatedDirection || configs.direction;
		const animatedConfigs = directionAnimatedConfigs(
			animatedDirection, 10, this.enterAnimation, finalBorderRadius,
		);
		const snappingPosition = directionSnap(
			containerLayout.y, containerLayout.x,
			containerLayout.width, containerLayout.height,
			layout.width, layout.height,
			configs.direction, configs.spacing,
			screenSize,
		);
		const arrowPosition = arrowSnap(layout.width, layout.height, arrowSize, configs.direction);
		const wrapperStyles = {
			position: 'absolute',
			top: snappingPosition.top + positionOffset.top,
			left: snappingPosition.left + positionOffset.left,
			opacity: layout.width ? 1 : 0,
		};
		const containerStyles = {
			transform: animatedConfigs.transform,
			opacity: animatedConfigs.opacity,
			...animatedConfigs.borderRadius,
		};
		const arrowStyle = {
			position: 'absolute',
			top: arrowPosition.top + arrowOffset.top,
			left: arrowPosition.left + arrowOffset.left,
			transform: arrowPosition.transform || [],
			width: arrowSize + 2,
			height: arrowSize * 2,
		};

		return <View style={[wrapperStyles, { zIndex: configs.zIndex }]} onLayout={this.onLayout}>
			<Animated.View style={[styles.dropdownContainer, configs.wrapperStyle, containerStyles]}>
				<InnerComponent
					configs={configs}
					animation={this.enterAnimation}
					context={context}
					close={this.closeModal}/>
				{configs.showArrow !== false && <Svg style={arrowStyle}>
					<Path
						d={drawArrow(arrowSize)}
						transform="translate(2,0)"
						fill={backgroundColor}/>
				</Svg>}
			</Animated.View>
		</View>;
	}

	closeModal = () => {
		const { dispatch, configs } = this.props;
		dispatch(appActions.toggleDropdown(false, configs));
	};

	onLayout = ({ nativeEvent }) => {
		this.setState({ layout: nativeEvent.layout });
	};
}

export default connect(() => {
	return {

	};
})(RuuiDropdown);

function EmptyDropdown(props) {
	return <View>
		<Text>Default dropdown</Text>
	</View>;
}

const drawArrow = (size) => {
	const width = size;
	const height = size * 2;
	const baseSize = width / 2.8;
	const topCurve = `Q0 ${baseSize / 2}, ${baseSize} ${baseSize}`;
	const topEdge = `Q${width} ${(height / 2) - baseSize}, ${width} ${height / 2}`;
	const bottomEdge = `Q${width} ${(height / 2) + baseSize}, ${baseSize} ${height - baseSize}`;
	const bottomCurve = `Q${0} ${height - (baseSize / 2)}, 0 ${height}`;

	return `M-2,0 L0,0 ${topCurve} ${topEdge} ${bottomEdge} ${bottomCurve} L-2,${height} Z`;
};

const styles = StyleSheet.create({
	container: {
		zIndex: 1000,
		position: 'absolute',
		top: 0, bottom: 0, left: 0, right: 0,
	},
	touchableMask: {
		position: 'absolute',
		top: 0, bottom: 0, left: 0, right: 0,
	},
	dropdownContainer: {
		backgroundColor: '#ffffff',
		borderRadius: 3,
	},
});
