import React, { Component } from 'react';
import { NetInfo, View, Text, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';

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
		if (this.props.store) {
			this.subscribeAndUpdateNetworkInfo();
		}
	}

	componentWillUnmount() {
		if (this.props.store) {
			NetInfo.removeEventListener('change', this.handleConnectionTypeChange);
			NetInfo.isConnected.removeEventListener('change', this.handleIsConnectedChange);
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

	subscribeAndUpdateNetworkInfo = () => {
		NetInfo.addEventListener('change', this.handleConnectionTypeChange);
		NetInfo.isConnected.addEventListener('change', this.handleIsConnectedChange);
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