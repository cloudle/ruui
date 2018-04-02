import React, { Component } from 'react';
import { Animated, Easing, NetInfo, ActivityIndicator, View, Text, StyleSheet } from 'react-native';

import Button from '../components/button';
import { connect } from '../utils/ruuiStore';
import * as appActions from '../utils/store/appAction';
import type { Style, Element } from '../typeDefinition';

type Props = {
	dispatch?: Function,
	netInfo?: Object,
	wrapperStyle?: Style,
	contentRenderer?: Function,
	message?: Element,
	retryButtonCaption?: string,
	retryButtonIcon?: Element,
	retryButtonRightIcon?: Element,
	retryButtonWrapperStyle?: Style,
	retryButtonInnerStyle?: Style,
};

@connect(({ netInfo }) => {
	return {
		netInfo,
	};
})

export default class ConnectionMask extends Component {
	props: Props;

	static defaultProps = {
		message: <Text
			style={{
				color: '#ffffff',
				fontSize: 20, textAlign: 'center',
			}}>App need internet connection, waiting for reconnect..</Text>,
		retryButtonCaption: 'Retry',
	};

	constructor(props) {
		super(props);
		this.state = {
			enterAnimation: new Animated.Value(0),
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.netInfo.isConnected !== this.props.netInfo.isConnected) {
			this.playAnimation(nextProps.netInfo.isConnected ? 0 : 1);
		}
	}

	render() {
		const pointerEvents = this.props.netInfo.isConnected ? 'none' : 'auto',
			opacity = this.state.enterAnimation.interpolate({
				inputRange: [0, 1], outputRange: [0, 1],
			}),
			containerStyle = { opacity, };

		return <Animated.View
			pointerEvents={pointerEvents}
			style={[styles.container, this.props.wrapperStyle, containerStyle]}>
			{this.props.contentRenderer
				? this.props.contentRenderer(this.props.netInfo)
				: <View style={styles.innerContainer}>
					{this.props.message}
					<ActivityIndicator color="#ffffff" style={styles.activityIndicator}/>
					<Button
						title={this.props.retryButtonCaption}
						icon={this.props.retryButtonIcon}
						rightIcon={this.props.retryButtonRightIcon}
						wrapperStyle={this.props.retryButtonWrapperStyle}
						innerStyle={this.props.retryButtonInnerStyle}
						onPress={this.retry}/>
				</View>}
		</Animated.View>;
	}

	retry = () => {
		NetInfo.isConnected.fetch().then((isConnected) => {
			this.props.dispatch(appActions.updateNetInfo({ isConnected }));
		});
	};

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

const styles = StyleSheet.create({
	container: {
		position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.7)',
	},
	innerContainer: {
		position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
		justifyContent: 'center', alignItems: 'center',
		paddingHorizontal: 28,
	},
	activityIndicator: {
		marginVertical: 20,
	},
});