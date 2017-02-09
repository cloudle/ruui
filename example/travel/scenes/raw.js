import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { Button, Input } from 'react-universal-ui';

export default class RawScene extends Component {
	render () {
		return <View style={{flex: 1, marginTop: 24,}}>
			<Text>Raw scene</Text>
			<View style={{margin: 10}}>
				<Button
					title="Button"
					innerStyle={{backgroundColor: '#00bcd4'}}/>
			</View>
			<Input floatingLabel="User name"/>
		</View>
	}
}