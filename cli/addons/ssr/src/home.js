import React from 'react';
import { StyleSheet, View, Text, } from 'react-native';

import { INavigation, IRoute, } from 'typeDefinitions';

type Props = {
	navigation?: INavigation,
	route?: IRoute,
};

const Home = (props: Props) => {
	const { navigation, route, } = props;

	return <View style={styles.container}>
		<Text style={styles.welcome}>Universal Navigation powered</Text>
		<Text style={styles.instructions}>
			edit src/home.js to update this screen
		</Text>
		<Text
			style={styles.link}
			onPress={() => navigation.navigate('Welcome')}>
			back to Welcome
		</Text>
	</View>;
};

export default Home;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
	link: {
		marginTop: 18,
		color: '#00bcd4',
		textDecorationLine: 'underline',
		cursor: 'pointer',
	},
});
