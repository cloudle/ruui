import React, { Component } from 'react';
import { Animated, Easing, View, Text, TextInput, StyleSheet } from 'react-native';
import { minGuard } from '../utils';

export default class Input extends Component {
	static propTypes = {
		wrapperStyle: React.PropTypes.any,
		underLineStyle: React.PropTypes.any,
		hint: React.PropTypes.string,
		floatingLabel: React.PropTypes.string,
		forceFloating: React.PropTypes.bool,
	};

	static defaultProps = {
		value: '',
	};

	constructor (props) {
	  super(props);
	  const empty = !this.props.value.length,
		  initialFloating = this.props.forceFloating || !empty ? 1 : 0;

	  this.state = {
			underLineAnimation: new Animated.Value(0),
		  floatingAnimation: new Animated.Value(initialFloating),
		  floatingLabelWidth: 0,
		  floatingLabelHeight: 0,
		  inputContainerLocation: { x: 0, y: 0 },
		  value: this.props.value,
		  empty,
	  }
	}

	render () {
		const scale = this.state.underLineAnimation.interpolate({
			inputRange: [0, 1], outputRange: [0.0001, 1]
		}), underLineStyles = {
			...this.props.underLineStyle,
			transform:[{ scaleX: scale }],
		}, inputContainerStyles = this::buildInputContainerStyles(this.props.wrapperStyle);

		return <View style={[styles.container, inputContainerStyles]}>
			<View style={{marginLeft: 8, marginRight: 8}}>
				<TextInput
					onChangeText={this::onChangeText}
					defaultValue={this.props.value}
					style={styles.textInput}
					underlineColorAndroid="transparent"
					onFocus={playAnimation.bind(this, 1)}
					onBlur={playAnimation.bind(this, 0)}/>
				{this.renderFloatingLabel()}
			</View>
			<Animated.View style={[styles.inputUnderLine, underLineStyles]}/>
		</View>
	}

	renderFloatingLabel () {
		if (this.props.floatingLabel) {
			const scaleSize = 0.8,
				scaledWidth = this.state.floatingLabelWidth * (1.05 - scaleSize),
				sideScaledWidth = scaledWidth / 2,
				scale = this.state.floatingAnimation.interpolate({
					inputRange: [0, 1], outputRange: [1, scaleSize],
				}),
				translateY = this.state.floatingAnimation.interpolate({
					inputRange: [0, 1], outputRange: [0, -this.state.floatingLabelHeight],
				}),
				translateX = this.state.floatingAnimation.interpolate({
					inputRange: [0, 1], outputRange: [0, -sideScaledWidth]
				}),
				wrapperStyles = {
					transform:[{scale}, {translateX}, {translateY}],
				},
				textStyles = {
					color: '#888888',
				};

			return <Animated.View
				pointerEvents="none"
				onLayout={this::onFloatingLabelLayout}
				style={[styles.floatingLabelWrapper, wrapperStyles]}>
				<Text style={[styles.floatingLabelText, textStyles]}>
					{this.props.floatingLabel}
				</Text>
			</Animated.View>
		}
	}
}

const easeInSpeed = 450,
	easeOutSpeed = easeInSpeed;

function onChangeText (nextValue) {
	this.setState({value: nextValue, empty: !nextValue.length})
}

function playAnimation (toValue: Number) {
	if (this.animation) this.animation.clear();

	let animations = [
		Animated.timing(this.state.underLineAnimation, {
			toValue,
			duration: easeInSpeed,
			easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
		})
	];

	if (this.state.empty) {
		const floatingAnimation = Animated.timing(this.state.floatingAnimation, {
			toValue,
			duration: easeInSpeed,
			easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
		});

		animations.push(floatingAnimation);
	}

	this.animation = Animated.parallel(animations).start();
}

function onFloatingLabelLayout ({ nativeEvent: { layout } }) {
	if (!this.state.floatingLabelWidth) this.setState({
		floatingLabelWidth: layout.width,
		floatingLabelHeight: layout.height,
	})
}
function buildInputContainerStyles (defaults = {}) {
	return {
		...defaults,
		marginTop: (defaults.marginTop || 0) +
							 (this.props.floatingLabel ? 20 : 0),
	};
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#FFFFFF',
		borderBottomWidth: 1,
		borderColor: '#f5f5f5',
		marginBottom: -1,
	},
	textInput: {
		height: 30,
		fontSize: 16,
	},
	inputUnderLine: {
		height: 2,
		backgroundColor: '#F0871A',
	},
	floatingLabelWrapper: {
		position: 'absolute',
		justifyContent: 'center',
		height: 30,
	},
	floatingLabelText: {
		backgroundColor: 'transparent',
		fontSize: 16,
	}
});