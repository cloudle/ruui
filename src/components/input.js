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
	editable?: Boolean,
	onFocus?: Function,
	onBlur?: Function,
};

const easeInSpeed = 450;

class RuuiInput extends Component<any, Props, any> {
	props: Props;

	static defaultProps = {
		underline: true,
		editable: true,
	};

	constructor(props) {
		super(props);
		const shouldFloating = props.value && props.value.length > 0,
			initialFloating = props.forceFloating || shouldFloating ? 1 : 0;

		this.underlineAnimation = new Animated.Value(0);
		this.floatingAnimation = new Animated.Value(initialFloating);
		this.state = {
			floatingLabelWidth: 0,
			floatingLabelHeight: 0,
			focus: false,
		};
	}

	componentDidUpdate(prevProps) {
		const { focus } = this.state,
			{ floatingLabel, value, } = this.props;

		if (floatingLabel) {
			if (value && value.length > 0) {
				if (!focus && (!prevProps.value || !prevProps.value.length)) {
					this.playFloatingLabelAnimation(1);
				}
			} else if (!focus && (!value || !value.length)) {
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
			{ focus, empty } = this.state,
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
			activeHint = focus && empty ? hint : '',
			platformProps = isAndroid ? { underlineColorAndroid: 'transparent' } : {};

		return <View
			pointerEvents={pointerEvents}
			style={[styles.container, containerStyles, inputContainerStyles]}>
			<View style={{ flexDirection: 'row', }}>
				<View style={styles.addonContainer}>{prefix}</View>
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
				<View style={styles.addonContainer}>{suffix}</View>
				{this.renderFloatingLabel()}
			</View>

			{underline && <Animated.View
				style={[styles.inputUnderline, underlineStyles]}/>}
		</View>;
	}

	renderFloatingLabel() {
		const { floatingLabel, floatingLabelStyle } = this.props,
			{ floatingLabelWidth, floatingLabelHeight } = this.state;

		if (floatingLabel) {
			const scaleSize = 0.8,
				scaledWidth = floatingLabelWidth * (1.05 - scaleSize),
				sideScaledWidth = scaledWidth / 2,
				scale = this.floatingAnimation.interpolate({
					inputRange: [0, 1], outputRange: [1, scaleSize],
				}),
				translateY = this.floatingAnimation.interpolate({
					inputRange: [0, 1], outputRange: [0, -floatingLabelHeight],
				}),
				translateX = this.floatingAnimation.interpolate({
					inputRange: [0, 1], outputRange: [0, -sideScaledWidth],
				}),
				wrapperStyles = {
					transform: [{ scale }, { translateX }, { translateY }],
				},
				textStyles = { color: '#888888', };

			return <Animated.View
				pointerEvents="none"
				onLayout={this.onFloatingLabelLayout}
				style={[styles.floatingLabelWrapper, wrapperStyles]}>
				<Text style={[styles.floatingLabelText, textStyles, floatingLabelStyle]}>
					{floatingLabel}
				</Text>
			</Animated.View>;
		} else {
			return <View/>;
		}
	}

	onFloatingLabelLayout = ({ nativeEvent: { layout } }) => {
		const { floatingLabelWidth } = this.state;

		if (!floatingLabelWidth) {
			this.setState({
				floatingLabelWidth: layout.width,
				floatingLabelHeight: layout.height,
			});
		}
	};

	onInputFocus = () => {
		const { editable, onFocus } = this.props;

		if (editable) {
			this.setState({ focus: true });
			this.playUnderlineAnimation(1);
			this.playFloatingLabelAnimation(1);
			if (onFocus) onFocus();
		}
	};

	onInputBlur = () => {
		const { forceFloating, value, onBlur } = this.props,
			noForceFloating = !forceFloating,
			hasEmptyValue = !value || !value.length;

		this.setState({ focus: false });
		this.playUnderlineAnimation(0);
		if (noForceFloating && hasEmptyValue) this.playFloatingLabelAnimation(0);
		if (onBlur) onBlur();
	};

	playFloatingLabelAnimation = (toValue: Number) => {
		if (this.floatingLabelAnimated) this.floatingLabelAnimated.clear();

		this.floatingLabelAnimated = Animated.timing(this.floatingAnimation, {
			toValue,
			duration: easeInSpeed,
			easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
			useNativeDriver: true,
		}).start();
	};

	playUnderlineAnimation = (toValue: Number) => {
		if (this.underlineAnimated) this.underlineAnimated.clear();

		this.underlineAnimated = Animated.timing(this.underlineAnimation, {
			toValue,
			duration: easeInSpeed,
			easing: Easing.in(Easing.bezier(0.23, 1, 0.32, 1)),
			useNativeDriver: true,
		}).start();
	};

	buildInputContainerStyles = (defaults = {}) => {
		const { floatingLabel } = this.props;

		return {
			...defaults,
			paddingTop: (defaults.paddingTop || 0) + (floatingLabel ? 24 : 0),
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

export default RuuiInput;

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
