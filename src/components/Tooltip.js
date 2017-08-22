import React, { Component } from 'react';
import { Dimensions, Animated, Easing, View, Text, StyleSheet } from 'react-native';

import { isBrowser, directionSnap } from '../utils';
import { Style, Element, SnappingDirection } from '../typeDefinition';

type Props = {
	wrapperStyle?: Style,
	direction?: SnappingDirection,
	positionSpacing?: number,
	positionOffset?: Object,
	containerSize?: Object,
	children?: string | Element,
};

export default class Tooltip extends Component<any, Props, any> {
	props: Props;

	static defaultProps = {
		direction: 'top',
		positionSpacing: 10,
		containerSize: { width: 0, height: 0 },
		positionOffset: { top: 0, left: 0 },
	};

	constructor(props) {
		super(props);
		this.state = {
			enterAnimation: new Animated.Value(0),
		};
	}

	componentDidMount() {
		const ScreenSize = Dimensions.get('window');

		this.container.measure((a, b, width, height, px, py) => {
			const containerSize = this.props.containerSize || { width: 0, height: 0 },
				snappingPosition = directionSnap(
					0, 0, containerSize.width, containerSize.height, width, height,
					this.props.direction, this.props.positionSpacing),
				rightEdgeDistance = (ScreenSize.width - 5) - (px + snappingPosition.left + width),
				leftEdgeDistance = px + snappingPosition.left,
				bottomEdgeDistance = (ScreenSize.height - 5) - (py + snappingPosition.top + height),
				topEdgeDistance = py + snappingPosition.top;

			let topOffset = snappingPosition.top + this.props.positionOffset.top,
				leftOffset = snappingPosition.left + this.props.positionOffset.left;

			if (leftEdgeDistance < 0) {
				leftOffset = leftEdgeDistance + 5;
			} else if (rightEdgeDistance < 0) {
				leftOffset = rightEdgeDistance;
			}

			if (topEdgeDistance < 0) {
				topOffset = topEdgeDistance + 5;
			} else if (bottomEdgeDistance < 0) {
				topOffset = bottomEdgeDistance;
			}

			this.setState({ leftOffset, topOffset, });
		});

		Animated.timing(this.state.enterAnimation, {
			toValue: 1,
			duration: 500,
			easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
		}).start();
	}

	render() {
		const children = typeof this.props.children === 'string'
				? <Text numberOfLines={1} style={styles.title}>{this.props.children}</Text>
				: this.props.children,
			translate = this.state.enterAnimation.interpolate({
				inputRange: [0, 1], outputRange: [15, 0],
			}), borderRadius = this.state.enterAnimation.interpolate({
				inputRange: [0, 0.5, 1], outputRange: [50, 15, 3],
			}), opacity = this.state.enterAnimation.interpolate({
				inputRange: [0, 1], outputRange: [0.2, 1],
				extrapolate: 'clamp',
			}),
			containerStyles = {
				transform: [{ translateY: translate }],
			},
			innerStyles = {
				borderTopLeftRadius: borderRadius,
				borderTopRightRadius: borderRadius,
				opacity,
			},
			edgeOffsets = {
				left: this.state.leftOffset,
				top: this.state.topOffset,
			};

		return <Animated.View
			pointerEvents="box-none"
			style={[styles.container, containerStyles]}>
			<View style={edgeOffsets} ref={(container) => { this.container = container; }}>
				<Animated.View style={[styles.innerContainer, innerStyles, this.props.wrapperStyle]}>
					{children}
				</Animated.View>
			</View>
		</Animated.View>;
	}
}

const styles = StyleSheet.create({
	container: {
		zIndex: 12,
		position: isBrowser ? 'fixed' : 'absolute',
	},
	innerContainer: {
		padding: 5, paddingHorizontal: 8,
		backgroundColor: 'rgb(97, 97, 97)',
		borderRadius: 3,
	},
	contentContainer: {
		position: 'absolute',
	},
	title: {
		fontSize: 11, fontWeight: '300',
		color: '#f5f5f5',
	},
});