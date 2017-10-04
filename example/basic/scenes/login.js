import React, { Component } from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import Icon from 'universal-vector-icons/Ionicons';

import { Input, Select } from '../../../src';

export default class LoginScene extends Component {
	constructor(props) {
		super(props);
		this.state = {
			company: emptyProducts[1],
		};
	}
	render() {
		return <ScrollView style={{ flex: 1, }}>
			<View style={{ flexDirection: 'row' }}>
				<View style={{ flex: 1, flexBasis: 0, }}>
					<Input
						forceFloating
						hint="Hi there"
						floatingLabel="User name"/>
				</View>
				<View style={{ flex: 1, flexBasis: 0, }}>
					<Select
						floatingLabel="Company"
						options={emptyProducts}
						value={this.state.company}/>
				</View>
			</View>
		</ScrollView>;
	}
}

const styles = StyleSheet.create({

});

const emptyProducts = [
	{ title: 'System 5', id: 0 },
	{ title: 'System 7', id: 1 },
];