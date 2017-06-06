import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import { Button, appAction } from '../../../src';

type Props = {
	dispatch?: Function,
};

@connect(({ app }) => {
	return {

	};
})

export default class GreetingModal extends Component {
	props: Props;

	render() {
		return <View style={{ width: 100, height: 200, backgroundColor: 'red', }}>
			<Text>Greeting</Text>
			<TouchableOpacity
				onPress={() => this.props.dispatch(appAction.toggleModal(false))}>
				<Text>Close this</Text>
			</TouchableOpacity>
		</View>;
	}
}

const styles = StyleSheet.create({

});