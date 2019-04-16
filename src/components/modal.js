import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, Easing, View, StyleSheet } from 'react-native';

import Selector from './selector';
import LoadingMask from './loadingMask';
import CloseableModal from './closeableModal';
import { valueAt } from '../utils';
import * as appActions from '../utils/store/appAction';

type Props = {
	active?: any,
	type?: string,
	configs?: Object,
	modalCount?: number,
	dispatch?: Function,
};

export default class RuuiModal extends Component {
	static props: Props;

	static contextTypes = {
		ruuiConfigs: PropTypes.object,
	};

	constructor(props) {
		super(props);
		this.state = {
			enterAnimation: new Animated.Value(0),
			active: props.active,
		};
	}

	componentDidMount() {
		this.playTransition(this.props.active);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.active !== this.props.active) {
			this.playTransition(nextProps.active);
		}
	}

	playTransition(active) {
		const nextValue = active ? 1 : 0;

		if (!active) {
			this.playAnimation(nextValue, () => {
				this.setState({ active: null });
			});
		} else {
			this.setState({ active });
			this.playAnimation(nextValue);
		}
	}

	render() {
		const { enterAnimation, active } = this.state,
			{ configs = {}, modalCount, type: modalType } = this.props,
			globalConfigs = valueAt(this, 'context.ruuiConfigs.modal'),
			containerPropsGenerator = configs.maskProps || globalConfigs.maskProps,
			containerProps = containerPropsGenerator(enterAnimation, configs, modalCount, modalType);

		if (configs.maskProps && !containerProps.style) {
			containerProps.style = globalConfigs.maskProps(
				enterAnimation, configs, modalCount, modalType).style;
		}

		return active ? <Animated.View {...containerProps}>
			<View style={styles.innerTouchable}>
				{this.renderModalInner()}
			</View>
		</Animated.View> : <View/>;
	}

	renderModalInner() {
		const { enterAnimation } = this.state,
			{ dispatch, type: modalType, active, configs: modalConfigs } = this.props;

		switch (modalType) {
		case 'select':
			return <Selector
				onRequestClose={configs => dispatch(appActions.toggleSelector(false, configs))}
				animation={enterAnimation}
				active={active}
				configs={modalConfigs}/>;
		case 'modal':
			return <CloseableModal
				onRequestClose={configs => dispatch(appActions.toggleModal(false, configs))}
				animation={enterAnimation}
				active={active}
				configs={modalConfigs}/>;
		case 'loading':
			return <LoadingMask
				animation={enterAnimation}
				active={active}
				configs={modalConfigs}/>;
		default:
			return <View/>;
		}
	}

	playAnimation = (toValue: Number, callback) => {
		if (this.animation) this.animation.clear();

		const easing = toValue === 0
				? Easing.out(Easing.bezier(0, 0, 0.58, 1))
				: Easing.in(Easing.bezier(0, 0.48, 0.35, 1)),
			animations = [
				Animated.timing(this.state.enterAnimation, {
					toValue,
					duration: 500,
					easing,
				}),
			];

		this.animation = Animated.parallel(animations).start(callback);
	}
}

export function defaultMaskPropsGenerator(animation, configs, modalCount, modalType) {
	const averageOpacity = (0.8 / modalCount) + (modalCount * 0.1),
		backgroundColor = animation.interpolate({
			inputRange: [0, 1], outputRange: ['rgba(0, 0, 0, 0)', `rgba(0, 0, 0, ${averageOpacity})`],
		}),
		style = [styles.container, {
			zIndex: configs.zIndex,
			backgroundColor,
		}];

	return { style, };
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0, left: 0, right: 0, bottom: 0,
	},
	innerTouchable: {
		flex: 1,
	},
	touchableMask: {
		position: 'absolute',
		top: 0, right: 0, left: 0, bottom: 0,
	},
});
