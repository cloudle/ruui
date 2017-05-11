import React, { Component } from 'react';
import { Animated, Easing, View, Text, TextInput, StyleSheet } from 'react-native';
import { minGuard, isAndroid } from '../utils';
import { Style, Element } from '../typeDefinition';

type Props = {
	wrapperStyle?: Style,
	underLineStyle?: Style,
	hint?: string,
	hintColor?: string,
	floatingLabel?: string,
	forceFloating?: boolean,
	errorText?: string,
	disabled?: boolean,
	prefix?: Element,
	suffix?: Element,

	autoCapitalize?: boolean,
	autoCorrect?: boolean,
	autoFocus?: boolean,
	blurOnSubmit?: boolean,
	value?: any,
	defaultValue?: any,
	editable?: boolean,
	keyboardType?: string,
	maxLength?: number,
	returnKeyType?: string,
	secureTextEntry?: boolean,
	selectTextOnFocus?: boolean,

	onFocus?: Function,
	onBlur?: Function,
	onChangeText?: Function,
	onEndEditing?: Function,
};

const easeInSpeed = 450;

export default class Input extends Component<any, Props, any> {
	props: Props;

	static defaultProps = {
		value: '',
	};

	constructor(props) {
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
			focus: false,
		};
	}

	render() {
		const pointerEvents = this.props.disabled ? 'none' : 'auto',
			scale = this.state.underLineAnimation.interpolate({
				inputRange: [0, 1], outputRange: [0.0001, 1],
			}),
			underLineStyles = {
				...this.props.underLineStyle,
				transform: [{ scaleX: scale }],
			},
			inputContainerStyles = this.buildInputContainerStyles(this.props.wrapperStyle),
			hint = this.state.focus && this.state.empty ? this.props.hint : '',
			platformProps = isAndroid ? { underlineColorAndroid: 'transparent' } : {},
			dynamicProps = this.props.value ? { value: this.props.value } : {};

		return <View pointerEvents={pointerEvents} style={[styles.container, inputContainerStyles]}>
			<View style={{ flexDirection: 'row', }}>
				<View style={styles.addonContainer}>
					{this.props.prefix}
				</View>
				<View style={styles.inputContainer}>
					<TextInput
						onChangeText={this.onChangeText}
						onFocus={this.onInputFocus}
						onBlur={this.onInputBlur}
						autoCapitalize={this.props.autoCapitalize}
						autoCorrect={this.props.autoCorrect}
						autoFocus={this.props.autoFocus}
						blurOnSubmit={this.props.blurOnSubmit}
						editable={this.props.editable}
						keyboardType={this.props.keyboardType}
						maxLength={this.props.maxLength}
						returnKeyType={this.props.returnKeyType}
						secureTextEntry={this.props.secureTextEntry}
						selectTextOnFocus={this.props.selectTextOnFocus}
						onEndEditing={this.props.onEndEditing}
						defaultValue={this.props.defaultValue}
						style={styles.textInput}
						placeholder={hint}
						placeholderTextColor={this.props.hintColor}
						{...platformProps}
						{...dynamicProps}/>
				</View>
				<View style={styles.addonContainer}>
					{this.props.suffix}
				</View>
				{this.renderFloatingLabel()}
			</View>
			<Animated.View style={[styles.inputUnderLine, underLineStyles]}/>
		</View>;
	}

	renderFloatingLabel() {
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
					inputRange: [0, 1], outputRange: [0, -sideScaledWidth],
				}),
				wrapperStyles = {
					transform: [{ scale }, { translateX }, { translateY }],
				},
				textStyles = {
					color: '#888888',
				};

			return <Animated.View
				pointerEvents="none"
				onLayout={this.onFloatingLabelLayout}
				style={[styles.floatingLabelWrapper, wrapperStyles]}>
				<Text style={[styles.floatingLabelText, textStyles]}>
					{this.props.floatingLabel}
				</Text>
			</Animated.View>;
		} else {
			return <View/>;
		}
	}

	onFloatingLabelLayout = ({ nativeEvent: { layout } }) => {
		if (!this.state.floatingLabelWidth) {
			this.setState({
				floatingLabelWidth: layout.width,
				floatingLabelHeight: layout.height,
			});
		}
	};

	onChangeText = (nextValue) => {
		this.setState({ value: nextValue, empty: !nextValue.length });
		if (this.props.onChangeText) this.props.onChangeText(nextValue);
	};

	playAnimation = (toValue: Number) => {
		if (this.animation) this.animation.clear();
		this.setState({ focus: toValue === 1 });

		const animations = [
			Animated.timing(this.state.underLineAnimation, {
				toValue,
				duration: easeInSpeed,
				easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
			}),
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
	};

	onInputFocus = () => {
		this.playAnimation(1);
		if (this.props.onFocus) this.props.onFocus();
	};

	onInputBlur = () => {
		this.playAnimation(0);
		if (this.props.onBlur) this.props.onBlur();
	};

	buildInputContainerStyles = (defaults = {}) => {
		return {
			...defaults,
			paddingTop: (defaults.paddingTop || 0) + (this.props.floatingLabel ? 24 : 0),
		};
	}
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'transparent',
		borderBottomWidth: 1,
		borderColor: '#f5f5f5',
	},
	addonContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingTop: 6,
	},
	inputContainer: {
		flex: 1,
		marginLeft: 8,
		marginRight: 8,
	},
	textInput: {
		height: 30,
		fontSize: 16,
		paddingTop: 6,
		paddingBottom: 0,
		color: '#444444',
	},
	inputUnderLine: {
		height: 2,
		backgroundColor: '#F0871A',
		bottom: -1,
	},
	floatingLabelWrapper: {
		position: 'absolute',
		justifyContent: 'center',
		height: 30,
	},
	floatingLabelText: {
		backgroundColor: 'transparent',
		fontSize: 16,
	},
});