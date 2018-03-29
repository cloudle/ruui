import React, { Component } from 'react';
import PropTypes from 'prop-types';

import store from '../store';
import { Element } from '../typeDefinition';

type Props = {
	children?: Element,
	store?: Object,
};

export default class RuuiContextProvider extends Component {
	static props: Props;
	static childContextTypes = {
		ruuiStore: PropTypes.object,
	};

	constructor(props) {
		super(props);
		this.store = this.props.store || store;
	}

	getChildContext() {
		return {
			ruuiStore: this.store,
		};
	}

	render() {
		return this.props.children;
	}
}