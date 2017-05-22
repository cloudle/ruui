import React, { Component } from 'react';
import { PanResponder, View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import Modal from './Modal';

type Props = {
	modals?: Array<Object>,
};

@connect(({ app }) => {
	return {
		modals: app.activeModals,
	};
})

export default class Modals extends Component {
	props: Props;

	render() {
		return <View
			pointerEvents="none"
			style={styles.container}>
			{Object.keys(this.props.modals).map((modalKey) => {
				const modalConfigs = this.props.modals[modalKey];
				return <Modal key={modalKey} {...modalConfigs}/>;
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