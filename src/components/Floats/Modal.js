import React, { useRef, } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Text, } from 'react-native';
import Animated from 'react-native-reanimated';

import { spring, } from '../../utils';
import * as appActions from '../../utils/store/appAction';
import type { ModalOptions, } from '../../typeDefinition';

const { Clock, Value, useCode, call, cond, eq, greaterOrEq, set, interpolate, stopClock, } = Animated;
const translateDistance = 50;

type Props = {
	dispatch?: Function,
	item?: ModalOptions,
};

const Modal = (props: Props) => {
	const { dispatch, item, } = props;
	const { current: leaveState } = useRef(new Value(0));
	const { current: enterClock } = useRef(new Clock());
	const { current: leaveClock } = useRef(new Clock());
	const { current: enterTranslate } = useRef(new Value(translateDistance));
	const { current: leaveTranslate } = useRef(new Value(0));
	const InnerComponent = item.configs.component;

	const onClose = () => {
		dispatch(appActions.toggleModal(false, item.configs));
	};

	const enterAnimator = [
		set(enterTranslate, spring({ clock: enterClock, from: translateDistance, to: 0, })),
	];
	const leaveAnimator = [
		set(leaveTranslate, spring({ clock: leaveClock, from: 0, to: translateDistance })),
		cond(greaterOrEq(leaveTranslate, translateDistance), [stopClock(leaveClock), call([], onClose)]),
	];

	useCode(() => cond(eq(leaveState, 1), leaveAnimator, enterAnimator), []);

	const onRequestClose = () => leaveState.setValue(1);

	const translate = cond(eq(leaveState, 1), leaveTranslate, enterTranslate);
	const scale = interpolate(translate, {
		inputRange: [0, translateDistance],
		outputRange: [1, 0.5],
	});
	const maskOpacity = interpolate(translate, {
		inputRange: [0, translateDistance / 2, translateDistance],
		outputRange: [0.8, 0, 0],
	});
	const containerOpacity = cond(eq(leaveState, 1), maskOpacity, 1);
	const maskStyle = { opacity: maskOpacity, backgroundColor: '#000000', };
	const containerStyle = {
		opacity: containerOpacity,
		transform: [{ translateY: translate }, { scale }],
	};

	return <View style={styles.container}>
		<TouchableWithoutFeedback onPress={onRequestClose}>
			<Animated.View style={[StyleSheet.absoluteFill, maskStyle]}/>
		</TouchableWithoutFeedback>
		<Animated.View style={containerStyle}>
			<InnerComponent/>
		</Animated.View>
	</View>;
};

export default Modal;

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		alignItems: 'center',
		justifyContent: 'center',
	},
});
