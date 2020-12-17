import React from 'react';
import { View, StyleSheet, } from 'react-native';
import { RuuiProvider, Tooltip } from 'react-universal-ui';
import { Provider, } from 'react-redux';
import { NavigationContainer, } from '@react-navigation/native';
import { createStackNavigator, } from '@react-navigation/stack';

import { ruuiStore, appStore } from 'store';
import WelcomeScreen from './welcome';
import HomeScreen from './home';
import { routeConfig, } from './routes';

const Stack = createStackNavigator();
const linking = { config: routeConfig, };

type Props = {

};

const App = (props: Props) => {
	return <NavigationContainer linking={linking}>
		<Stack.Navigator headerMode="none">
			<Stack.Screen name="Welcome" component={WelcomeScreen}/>
			<Stack.Screen name="Home" component={HomeScreen}/>
		</Stack.Navigator>
	</NavigationContainer>;
};

const AppContainer = (props) => {
	return <RuuiProvider store={ruuiStore}>
		<Provider store={appStore}>
			<App/>
			<Tooltip/>
		</Provider>
	</RuuiProvider>;
}

export default AppContainer;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
});
