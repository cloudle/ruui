import React, { Component } from 'react';
import { Animated, StyleSheet, View, Text, Easing, } from 'react-native';
import { isString } from 'lodash';

import { connect, isBrowser, directionSnap, directionAnimatedConfigs } from '../utils';
import type { Dimension, Layout, PositionOffset, Element, Style, } from '../typeDefinition';

type Props = {
	tooltip?: {
		active?: Boolean,
		configs?: {
			targetLayout: Layout,
			direction: String,
			positionSpacing?: Number,
			positionOffset?: PositionOffset,
			wrapperStyle?: Style,
			content?: String | Element,
		},
	},
	screenSize?: Dimension,
};

@connect(({ dimensions, tooltip }) => {
	return {
		screenSize: dimensions.window,
		tooltip,
	};
})

export default class RuuiTooltip extends Component {
	props: Props;

	constructor(props) {
		super(props);
		this.enterAnimation = new Animated.Value(0);
		this.state = {
			top: 0, left: 0,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.tooltip.active !== this.props.tooltip.active) {
			this.container.measure((x, y, width, height) => {
				const { targetLayout, direction, positionSpacing } = nextProps.tooltip.configs;

				this.setState(directionSnap(
					targetLayout.y, targetLayout.x,
					targetLayout.width, targetLayout.height,
					width, height,
					direction, positionSpacing));

				Animated.timing(this.enterAnimation, {
					toValue: nextProps.tooltip.active ? 1 : 0,
					duration: 500,
					easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
				}).start();
			});
		}
	}

	render() {
		const animatedConfigs = directionAnimatedConfigs(
				this.props.tooltip.configs.direction, 10, this.enterAnimation),
			wrapperStyle = {
				top: this.state.top, left: this.state.left,
				transform: animatedConfigs.transform,
				opacity: animatedConfigs.opacity,
			},
			innerStyles = animatedConfigs.borderRadius;

		return <Animated.View pointerEvents="none" style={[styles.wrapper, wrapperStyle]}>
			<View ref={(instance) => { this.container = instance; }}>
				<Animated.View style={[styles.container, innerStyles]}>
					{this.renderContent()}
				</Animated.View>
			</View>
		</Animated.View>;
	}

	renderContent = () => {
		const content = this.props.tooltip.configs.content;

		if (isString(content)) {
			return <Text style={styles.title}>{content}</Text>;
		} else {
			return content;
		}
	};
}

export const styles = StyleSheet.create({
	wrapper: {
		position: isBrowser ? 'fixed' : 'absolute',
	},
	container: {
		padding: 5, paddingHorizontal: 8,
		backgroundColor: 'rgb(97, 97, 97)',
		borderRadius: 3,
	},
	title: {
		fontSize: 11, fontWeight: '300',
		color: '#f5f5f5',
	},
});