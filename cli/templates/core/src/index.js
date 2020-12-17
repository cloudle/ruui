import React from 'react';
import { View, StyleSheet, } from 'react-native';
import { RuuiProvider, Tooltip } from 'react-universal-ui';

import Welcome from './welcome';

type Props = {

};

const App = (props: Props) => {
	return <View style={styles.container}>
		<Welcome/>
	</View>;
};

const AppContainer = (props) => {
	return <RuuiProvider>
		<App/>
		<Tooltip/>
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
