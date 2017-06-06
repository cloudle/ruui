import React, { Component } from 'react';
import { PanResponder, View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import Modal from './Modal';

type Props = {
	modals?: Array<Object>,
	dispatch?: Function,
};

@connect(({ app }) => {
	return {
		modals: app.activeModals,
	};
})

export default class Modals extends Component {
	props: Props;

	render() {
		const modalArray = Object.keys(this.props.modals) || [];

		return <View
			pointerEvents="box-none"
			style={styles.container}>
			{modalArray.map((modalKey) => {
				const modalConfigs = this.props.modals[modalKey];
				return <Modal
					key={modalKey}
					modalCount={modalArray.length}
					dispatch={this.props.dispatch}
					{...modalConfigs}/>;
			})}
		</View>;
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0, left: 0, right: 0, bottom: 0,
	},
});