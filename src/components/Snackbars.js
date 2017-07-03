import React, { Component } from 'react';
import { Animated, Easing, View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import Snackbar from './Snackbar';
import * as appActions from '../utils/store/appAction';

type Props = {
	dispatch?: Function,
	margin?: number,
	minWidth?: number,
	snackBars?: Object,
	animationSpeed?: number,
};

const snackbarRadius = 3;

@connect(({ app }) => {
	return {
		snackBars: app.snackBars,
	};
})

export default class Snackbars extends Component<any, Props, any> {
	props: Props;

	static defaultProps = {
		animationSpeed: 1000,
		minWidth: 300,
		margin: 15,
	};

	render() {
		return <View
			pointerEvents="box-none"
			style={styles.container}>
			{this.renderBars()}
		</View>;
	}

	renderBars() {
		let aliveIndex = -1; const bars = [];

		for (let i = 0; i < this.props.snackBars.length; i += 1) {
			const barConfigs = this.props.snackBars[i];

			if (!barConfigs.destroying) aliveIndex += 1;

			bars.push(<Snackbar
				configs={barConfigs}
				key={barConfigs.id}
				aliveIndex={aliveIndex}
				onStartTimeout={this.onStartBarTimeout}
				onTimeout={this.onBarTimeout}/>);
		}

		return bars;
	}

	onStartBarTimeout = (configs) => {
		this.props.dispatch(appActions.startDestroySnackBar(configs));
	};

	onBarTimeout = (configs) => {
		this.props.dispatch(appActions.destroySnackBar(configs));
	};
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
	},
	message: {
		color: '#ffffff',
	},
});