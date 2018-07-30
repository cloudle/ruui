import React, { Component } from 'react';
import { Animated, Easing, View, Text, TextInput, StyleSheet } from 'react-native';
import { minGuard, isAndroid } from '../utils';
import { Style, Element } from '../typeDefinition';

type Props = {
	style?: Style,
	wrapperStyle?: Style,
	underlineStyle?: Style,
	floatingLabelStyle?: Style,
	underline?: boolean,
	hint?: string,
	hintColor?: string,
	floatingLabel?: string,
	forceFloating?: boolean,
	errorText?: string,
	disabled?: boolean,
	prefix?: Element,
	suffix?: Element,

	value?: any,
	onFocus?: Function,
	onBlur?: Function,
};

const easeInSpeed = 450;

export default class RuuiInput extends Component<any, Props, any> {
	props: Props;

	static defaultProps = {
		underline: true,
	};

	constructor(props) {
		super(props);
		const shouldFloating = this.props.value && this.props.value.length > 0,
			initialFloating = this.props.forceFloating || shouldFloating ? 1 : 0;

		this.underlineAnimation = new Animated.Value(0);
		this.floatingAnimation = new Animated.Value(initialFloating);
		this.state = {
			floatingLabelWidth: 0,
			floatingLabelHeight: 0,
			focus: false,
		};
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.floatingLabel) {
			if (nextProps.value && nextProps.value.length > 0) {
				/* previous value is Empty? */
				if (!this.state.focus && (!this.props.value || !this.props.value.length)) {
					this.playFloatingLabelAnimation(1);
				}
			} else if (!this.state.focus && (!nextProps.value || !nextProps.value.length)) {
				this.playFloatingLabelAnimation(0);
			}
		}
	}

	render() {
		const {
				style,
				wrapperStyle,
				underlineStyle,
				floatingLabelStyle,
				underline,
				hint,
				hintColor,
				floatingLabel,
				forceFloating,
				errorText,
				disabled,
				prefix,
				suffix,
				...textInputProps } = this.props,
			pointerEvents = disabled ? 'none' : 'auto',
			scale = this.underlineAnimation.interpolate({
				inputRange: [0, 1], outputRange: [0.0001, 1],
			}),
			containerStyles = underline ? {
				borderBottomWidth: 1,
				borderColor: '#f5f5f5',
			} : {},
			flattenUnderlineStyle = StyleSheet.flatten(underlineStyle) || {},
			underlineStyles = {
				...flattenUnderlineStyle,
				transform: [{ scaleX: scale }],
			},
			inputContainerStyles = this.buildInputContainerStyles(wrapperStyle),
			activeHint = this.state.focus && this.state.empty ? hint : '',
			platformProps = isAndroid ? { underlineColorAndroid: 'transparent' } : {};

		return <View
			pointerEvents={pointerEvents}
			style={[styles.container, containerStyles, inputContainerStyles]}>
			<View style={{ flexDirection: 'row', }}>
				<View style={styles.addonContainer}>
					{prefix}
				</View>
				<View style={styles.inputContainer}>
					<TextInput
						ref={(instance) => { this.textInput = instance; }}
						{...textInputProps}
						onFocus={this.onInputFocus}
						onBlur={this.onInputBlur}
						style={[styles.textInput, style]}
						placeholder={activeHint}
						placeholderTextColor={hintColor}
						{...platformProps}/>
				</View>
				<View style={styles.addonContainer}>
					{suffix}
				</View>
				{this.renderFloatingLabel()}
			</View>

			{underline && <Animated.View
				style={[styles.inputUnderline, underlineStyles]}/>}
		</View>;
	}

	renderFloatingLabel() {
		if (this.props.floatingLabel) {
			const scaleSize = 0.8,
				scaledWidth = this.state.floatingLabelWidth * (1.05 - scaleSize),
				sideScaledWidth = scaledWidth / 2,
				scale = this.floatingAnimation.interpolate({
					inputRange: [0, 1], outputRange: [1, scaleSize],
				}),
				translateY = this.floatingAnimation.interpolate({
					inputRange: [0, 1], outputRange: [0, -this.state.floatingLabelHeight],
				}),
				translateX = this.floatingAnimation.interpolate({
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
				<Text style={[styles.floatingLabelText, textStyles, this.props.floatingLabelStyle]}>
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

	onInputFocus = () => {
		this.setState({ focus: true });
		this.playUnderlineAnimation(1);
		this.playFloatingLabelAnimation(1);
		setTimeout(() => {
			if (this.props.onFocus) this.props.onFocus();
		}, 0);
	};

	onInputBlur = () => {
		const noForceFloating = !this.props.forceFloating,
			hasEmptyValue = !this.props.value || !this.props.value.length;

		this.setState({ focus: false });
		this.playUnderlineAnimation(0);
		if (noForceFloating && hasEmptyValue) this.playFloatingLabelAnimation(0);
		if (this.props.onBlur) this.props.onBlur();
	};

	playFloatingLabelAnimation = (toValue: Number) => {
		if (this.floatingLabelAnimated) this.floatingLabelAnimated.clear();

		this.floatingLabelAnimated = Animated.timing(this.floatingAnimation, {
			toValue,
			duration: easeInSpeed,
			easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
		}).start();
	};

	playUnderlineAnimation = (toValue: Number) => {
		if (this.underlineAnimated) this.underlineAnimated.clear();

		this.underlineAnimated = Animated.timing(this.underlineAnimation, {
			toValue,
			duration: easeInSpeed,
			easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
		}).start();
	};

	buildInputContainerStyles = (defaults = {}) => {
		return {
			...defaults,
			paddingTop: (defaults.paddingTop || 0) + (this.props.floatingLabel ? 24 : 0),
		};
	};

	focus = () => {
		return this.textInput.focus && this.textInput.focus();
	};

	blur = () => {
		return this.textInput.blur && this.textInput.blur();
	};

	clear = () => {
		return this.textInput.clear && this.textInput.clear();
	};

	isFocused = () => {
		return this.textInput.isFocused && this.textInput.isFocused();
	};
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'transparent',
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
	inputUnderline: {
		height: 2,
		backgroundColor: '#F0871A',
		bottom: -1,
	},
	floatingLabelWrapper: {
		position: 'absolute',
		justifyContent: 'center',
		height: 30, marginLeft: 8,
	},
	floatingLabelText: {
		backgroundColor: 'transparent',
		fontSize: 16,
	},
});
