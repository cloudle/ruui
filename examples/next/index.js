import React, { useContext, } from 'react';
import { StyleSheet, View, Text, } from 'react-native';
import { Provider, RuuiContext, TouchableRipple, } from '../../src';

type Props = {

};

function App(props: Props) {
	const store = useContext(RuuiContext);

	return <View style={styles.container}>
		<TouchableRipple style={styles.buttonContainer}>
			<Text style={styles.buttonText}>App</Text>
		</TouchableRipple>
	</View>;
}

export default function AppContainer() {
	return <Provider>
		<App/>
	</Provider>;
};

const styles = StyleSheet.create({
	container: {
		flex: 1, alignItems: 'center', justifyContent: 'center',
	},
	buttonContainer: {
		backgroundColor: 'red',
		borderRadius: 5,
		padding: 12,
	},
	buttonText: {
		color: '#ffffff',
	},
});
