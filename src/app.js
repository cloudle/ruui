import React, { Component } from 'react';
import { StatusBar, View, Text } from 'react-native';

import { isIos, isAndroid } from './utils';
import { Button, Input } from './components';
import Icon from 'react-native-vector-icons/Ionicons';

export default function () {
	return <View>
		<Text>Hello world!</Text>
		<Button
			wrapperStyle={{backgroundColor: '#00bcd4'}}
			icon={<Icon name="ios-albums-outline" style={{fontSize: 20}}/>}
			title="Click me!!" onPress={() => console.log("Yay!")}/>
		<Button
			wrapperStyle={{backgroundColor: '#FFFFFF'}}
			rippleColor="#666666"
			textStyle={{color: "#666666"}}
			icon={<Icon name="ios-albums-outline" style={{fontSize: 20}}/>}
			title="Click me!!" onPress={() => console.log("Yay!")}/>
		<Input floatingLabel="Email"/>
	</View>
}

if (isIos) {
	StatusBar.setBarStyle('light-content', true);
} else if (isAndroid) {
	StatusBar.setBackgroundColor('transparent');
	StatusBar.setTranslucent(true);
}