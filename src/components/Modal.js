import React, { Component } from 'react';
import { Animated, Easing, View, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import * as appActions from '../utils/store/appAction';
import Selector from './Selector';
import LoadingMask from './LoadingMask';
import CloseableModal from './CloseableModal';

type Props = {
	active?: any,
	type?: string,
	configs?: Object,
	modalCount?: number,
	dispatch?: Function,
};

export default class Modal extends Component {
	props: Props;

	constructor(props) {
		super(props);
		this.state = {
			enterAnimation: new Animated.Value(0),
			active: this.props.active,
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
		const averageOpacity = (0.8 / this.props.modalCount) + (this.props.modalCount * 0.1),
			backgroundColor = this.state.enterAnimation.interpolate({
				inputRange: [0, 1], outputRange: ['rgba(0, 0, 0, 0)', `rgba(0, 0, 0, ${averageOpacity})`],
			}),
			containerStyles = {
				backgroundColor,
			};

		return this.state.active ? <Animated.View
			style={[styles.container, containerStyles]}>
			<View style={styles.innerTouchable}>
				{this.renderModalInner()}
			</View>
		</Animated.View> : <View/>;
	}

	renderModalInner() {
		switch (this.props.type) {
		case 'select':
			return <Selector
				animation={this.state.enterAnimation}
				configs={this.props.configs}/>;
		case 'modal':
			return <CloseableModal
				animation={this.state.enterAnimation}
				configs={this.props.configs}/>;
		case 'loading':
			return <LoadingMask
				animation={this.state.enterAnimation}
				configs={this.props.configs}/>;
		default:
			return <View/>;
		}
	}

	onBackdropPress = () => {
		this.props.dispatch(appActions.toggleSelect(false));
	};

	playAnimation = (toValue: Number, callback) => {
		if (this.animation) this.animation.clear();

		const animations = [
			Animated.timing(this.state.enterAnimation, {
				toValue,
				duration: 500,
				easing: Easing.in(Easing.bezier(0, 0.48, 0.35, 1)),
			}),
		];

		this.animation = Animated.parallel(animations).start(callback);
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0, left: 0, right: 0, bottom: 0,
	},
	innerTouchable: {
		flex: 1,
	},
});