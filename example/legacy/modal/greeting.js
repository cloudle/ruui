import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default class GreetingModal extends Component {
	render() {
		return <View style={{ width: 100, height: 200, backgroundColor: 'red', }}>
			<Text>Greeting</Text>
		</View>;
	}
}

const styles = StyleSheet.create({

});