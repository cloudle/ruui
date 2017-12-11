import React, { Component } from 'react';
import { NetInfo, Dimensions, View, Text, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';

import { isServer } from '../utils';
import * as appActions from '../utils/store/appAction';
import type { Element, Style } from '../typeDefinition';

type Props = {
	children?: Element,
	store?: Object,
	styles?: Style,
	themeConfigs?: Object,
};

export default class ContextProvider extends Component {
	props: Props;

	componentWillMount() {
		if (!isServer && this.props.store) {
			this.subscribeAndUpdateScreenSizes();
			this.subscribeAndUpdateNetworkInfo();
		}
	}

	componentWillUnmount() {
		if (!isServer && this.props.store) {
			NetInfo.removeEventListener('connectionChange', this.handleConnectionTypeChange);
			NetInfo.isConnected.removeEventListener('connectionChange', this.handleIsConnectedChange);
		}
	}

	render() {
		const reduxStore = this.props.store;

		return <View style={[styles.container, this.props.styles]}>
			{reduxStore ? <Provider store={reduxStore}>
				{this.props.children}
			</Provider> : this.props.children}
		</View>;
	}

	subscribeAndUpdateScreenSizes = () => {

	};

	handleScreenSizeChange = (data) => {

	};

	subscribeAndUpdateNetworkInfo = () => {
		NetInfo.getConnectionInfo()
			.then(connectionInfo => this.handleConnectionTypeChange(connectionInfo));

		NetInfo.isConnected.getConnectionInfo()
			.then(isConnected => this.handleIsConnectedChange(isConnected));

		NetInfo.addEventListener('connectionChange', this.handleConnectionTypeChange);
		NetInfo.isConnected.addEventListener('connectionChange', this.handleIsConnectedChange);
	};

	handleConnectionTypeChange = (connectionType) => {
		this.props.store.dispatch(appActions.updateNetInfo({ connectionType, }));
	};

	handleIsConnectedChange = (isConnected) => {
		this.props.store.dispatch(appActions.updateNetInfo({ isConnected, }));
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});