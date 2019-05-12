import React, { Component } from 'react';
import { NetInfo, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { merge } from 'lodash';

import { isServer } from '../utils';
import coreConfigs from '../configs/core';
import * as appActions from '../store/action/app';
import { Element, RuuiConfigs } from '../typeDefinition';

type Props = {
	children?: Element,
	store?: Object,
	configs?: RuuiConfigs,
	subscribeNetInfo?: Boolean,
	subscribeDimension?: Boolean,
};

const navigator = global.navigator || {},
	connectionModule = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

class RuuiProvider extends Component {
	static props: Props;

	static defaultProps = {
		configs: {},
		subscribeNetInfo: false,
		subscribeDimension: true,
	};

	static childContextTypes = {
		ruuiStore: PropTypes.object,
		ruuiConfigs: PropTypes.object,
	};

	constructor(props) {
		super(props);
		this.store = props.store;
		this.configs = merge({}, coreConfigs, props.configs);
	}

	getChildContext() {
		return {
			ruuiStore: this.store,
			ruuiConfigs: this.configs,
		};
	}

	componentDidMount() {
		const { store, subscribeDimension, subscribeNetInfo } = this.props;

		if (isServer || !store) return;
		if (subscribeDimension) this.subscribeAndUpdateDimensions();
		if (subscribeNetInfo && connectionModule) this.subscribeAndUpdateNetworkInfo();
	}

	componentWillUnmount() {
		const { store, subscribeDimension, subscribeNetInfo } = this.props;

		if (isServer || !store) return;

		if (subscribeDimension) {
			Dimensions.removeEventListener('change', this.handleDimensionChange);
		}

		if (subscribeNetInfo && connectionModule) {
			NetInfo.removeEventListener('connectionChange', this.handleConnectionTypeChange);
			NetInfo.isConnected.removeEventListener('connectionChange', this.handleIsConnectedChange);
		}
	}

	render() {
		const { children } = this.props;
		return children;
	}

	subscribeAndUpdateDimensions = () => {
		this.handleDimensionChange({
			window: Dimensions.get('window'),
			screen: Dimensions.get('screen'),
		});

		Dimensions.addEventListener('change', this.handleDimensionChange);
	};

	handleDimensionChange = (data) => {
		this.store.dispatch(appActions.updateDimensionsInfo(data));
	};

	subscribeAndUpdateNetworkInfo = () => {
		NetInfo.getConnectionInfo && NetInfo.getConnectionInfo()
			.then(connectionInfo => this.handleConnectionTypeChange(connectionInfo));

		NetInfo.isConnected.getConnectionInfo && NetInfo.isConnected.getConnectionInfo()
			.then(isConnected => this.handleIsConnectedChange(isConnected));

		NetInfo.addEventListener('connectionChange', this.handleConnectionTypeChange);
		NetInfo.isConnected.addEventListener('connectionChange', this.handleIsConnectedChange);
	};

	handleConnectionTypeChange = (connectionType) => {
		this.store.dispatch(appActions.updateNetInfo({ connectionType, }));
	};

	handleIsConnectedChange = (isConnected) => {
		this.store.dispatch(appActions.updateNetInfo({ isConnected, }));
	};
}

export default RuuiProvider;
