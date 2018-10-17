import React from 'react';
import { StackNavigator } from 'react-navigation';

import Welcome from './scenes/welcome';
import Login from './scenes/login';
import { colors } from './utils';

const backIcon = require('./images/white-back.png');

export default StackNavigator({
	Index: {
		screen: Login,
		navigationOptions: {
			title: 'Home'
		},
	},
	Welcome: {
		screen: Login,
	},
}, {
	navigationOptions: {
		gesturesEnabled: true,
		headerBackButtonAsset: backIcon,
		headerTintColor: '#ffffff',
		headerStyle: {
			backgroundColor: colors.main,
		},
	},
	cardStyle: {
		shadowColor: 'transparent',
	},
});