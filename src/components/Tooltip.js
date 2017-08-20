import React, { Component } from 'react';
import { Dimensions, Animated, Easing, View, Text, StyleSheet } from 'react-native';

import { isBrowser } from '../utils';
import { Style, Element } from '../typeDefinition';

type Props = {
	wrapperStyle?: Style,
	children?: string | Element,
};

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
	offsetStyle: {
		marginTop: -30, marginLeft: 0,
	},
	title: {
		fontSize: 11, fontWeight: '300',
		color: '#f5f5f5',
	},
});

export default class Tooltip extends Component<any, Props, any> {
	props: Props;

	static defaultProps = {
		wrapperStyle: styles.offsetStyle,
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
			const rightEdgeDistance = (ScreenSize.width - 5) - (width + px),
				leftEdgeDistance = px,
				bottomEdgeDistance = (ScreenSize.height - 5) - (height + py),
				topEdgeDistance = py;

			let leftOffset = 0, topOffset = 0;

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

		return <Animated.View style={[styles.container, containerStyles]}>
			<View style={edgeOffsets} ref={(container) => { this.container = container; }}>
				<Animated.View style={[styles.innerContainer, innerStyles, this.props.wrapperStyle]}>
					{children}
				</Animated.View>
			</View>
		</Animated.View>;
	}
}