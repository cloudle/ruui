import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { shallowEqual } from './helpers';

export function createStore(reducer) {
	let state, listeners = [];

	const getState = () => state;
	const getListeners = () => listeners;

	const dispatch = (action) => {
		state = reducer(state, action);
		listeners.forEach(listener => listener(state));
	};

	const subscribe = (listener) => {
		listeners.push(listener);

		return () => {
			listeners = listeners.filter(l => l !== listener);
		};
	};

	dispatch({});

	return { getState, dispatch, subscribe, getListeners };
}

export function combineReducers(reducers) {
	const reducerKeys = Object.keys(reducers);

	return (state = {}, action) => {
		let hasChanged = false;
		const nextState = {};

		for (let i = 0; i < reducerKeys.length; i += 1) {
			const key = reducerKeys[i],
				reducer = reducers[key],
				previousStateForKey = state[key],
				nextStateForKey = reducer(previousStateForKey, action);

			nextState[key] = nextStateForKey;
			hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
		}

		return hasChanged ? nextState : state;
	};
}

export function connect(stateToPropsFactory) {
	return function (BaseComponent) {
		const currentDisplayName = BaseComponent.displayName || BaseComponent.name,
			enhancedDisplayName = `RuuiConnect(${currentDisplayName})`;

		return class RuuiConnected extends Component {
			static displayName = enhancedDisplayName;
			static contextTypes = {
				ruuiStore: PropTypes.object,
			};

			constructor(props, context) {
				super(props);
				this.store = context.ruuiStore;
				this.unSubscribe = this.store.subscribe(this.syncProps);

				this.state = {
					generatedProps: stateToPropsFactory(this.store.getState()),
				};
			}

			componentWillUnmount() {
				this.unSubscribe();
			}

			render() {
				return <BaseComponent
					{...this.props}
					{...this.state.generatedProps}
					dispatch={this.store.dispatch}/>;
			}

			syncProps = () => {
				const nextProps = stateToPropsFactory(this.store.getState());

				if (!shallowEqual(this.state.generatedProps, nextProps)) {
					this.setState({ generatedProps: nextProps });
				}
			}
		};
	};
}