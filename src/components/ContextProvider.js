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
		/* Only watch System information if there is redux-store available*/
		if (this.props.store) {
			this.subscribeAndUpdateNetworkInfo();
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
		NetInfo.addEventListener('change', (connectionType) => {
			NetInfo.isConnected.fetch().then((isConnected) => {
				this.props.store.dispatch(appActions.updateNetInfo({
					isConnected,
					connectionType,
				}));
			});
		});
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});