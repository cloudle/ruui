import React, { Component } from 'react';
import { StyleSheet, View, Text, } from 'react-native';

import { connect } from '../../../src/utils/ruuiStore';

type Props = {
	counter?: Number | String,
	dispatch?: Function,
};

@connect(({ counter }) => {
	return {
		counter,
	};
})

export default class Counter extends Component {
	props: Props;

	render() {
		return <View style={styles.container}>
			<Text>Counter {this.props.counter}</Text>
		</View>;
	}
}

const styles = StyleSheet.create({
	container: {

	},
});
