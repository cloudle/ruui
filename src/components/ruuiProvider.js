import React, { Component } from 'react';
import { NetInfo, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { merge } from 'lodash';

import store from '../store';
import { isServer } from '../utils';
import coreConfigs from '../configs/core';
import * as appActions from '../store/action/app';
import { Element, RuuiConfigs } from '../typeDefinition';

type Props = {
	children?: Element,
	store?: Object,
	configs?: RuuiConfigs,
};

export default class RuuiProvider extends Component {
	static props: Props;
	static defaultProps = {
		store,
		configs: {},
	};
	static childContextTypes = {
		ruuiStore: PropTypes.object,
		ruuiConfigs: PropTypes.object,
	};

	constructor(props) {
		super(props);
		this.store = this.props.store;
		this.configs = merge({}, coreConfigs, this.props.configs);
	}

	getChildContext() {
		return {
			ruuiStore: this.store,
			ruuiConfigs: this.configs,
		};
	}

	componentWillMount() {
		if (!isServer && this.props.store) {
			this.subscribeAndUpdateDimensions();
			this.subscribeAndUpdateNetworkInfo();
		}
	}

	componentWillUnmount() {
		if (!isServer && this.props.store) {
			NetInfo.removeEventListener(
				'connectionChange', this.handleConnectionTypeChange);
			NetInfo.isConnected.removeEventListener(
				'connectionChange', this.handleIsConnectedChange);
		}
	}

	render() {
		return this.props.children;
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

		NetInfo.addEventListener(
			'connectionChange', this.handleConnectionTypeChange);
		NetInfo.isConnected.addEventListener(
			'connectionChange', this.handleIsConnectedChange);
	};

	handleConnectionTypeChange = (connectionType) => {
		this.store.dispatch(appActions.updateNetInfo({ connectionType, }));
	};

	handleIsConnectedChange = (isConnected) => {
		this.props.store.dispatch(appActions.updateNetInfo({ isConnected, }));
	};
}