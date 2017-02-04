import React, { Component } from 'react';
import { StatusBar, View, Text } from 'react-native';

import { isIos, isAndroid } from './utils';
import { Button } from './components';

export default function () {
	return <View>
		<Text>Hello world!</Text>
		<Button
			wrapperStyle={{backgroundColor: 'blue', width: 120}}
			title="Click me!!" onPress={() => alert("Yay!")}/>
	</View>
}

if (isIos) {
	StatusBar.setBarStyle('light-content', true);
} else if (isAndroid) {
	StatusBar.setBackgroundColor('transparent');
	StatusBar.setTranslucent(true);
}