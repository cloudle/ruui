import React, { Component } from 'react';
import { StyleSheet, View, Text, } from 'react-native';

import { Select } from '../../../src';

type Props = {

};

export default class TestModal extends Component {
	props: Props;

	render() {
		return <View style={styles.container}>
			<Select/>
		</View>;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1, alignItems: 'center', justifyContent: 'center',
	},
});