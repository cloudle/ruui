import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { merge } from 'lodash';

import store from '../store';
import coreConfigs from '../configs/core';
import { Element, RuuiConfigs } from '../typeDefinition';

type Props = {
	children?: Element,
	store?: Object,
	configs?: RuuiConfigs,
};

export default class RuuiContextProvider extends Component {
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

	render() {
		return this.props.children;
	}
}