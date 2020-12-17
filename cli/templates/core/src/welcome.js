import React, { useState, } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Button, } from 'react-universal-ui';

const instructions = Platform.select({
	ios: 'Press Cmd+R to reload,\n'
		+ 'Cmd+D or shake for dev menu',
	android: 'Double tap R on your keyboard to reload,\n'
		+ 'Shake or press menu button for dev menu',
	web: 'Command/Control+R to reload your browser :p\n'
		+ '\nAnd in Browser, we have great advantage\nwhen using Chrome Developer Tool\ncompare to the poor native-dev-menu!',
});

type Props = {

};

const Welcome = (props: Props) => {
	const [counter, setCounter] = useState(0);
	const increaseCounter = () => setCounter(counter + 1);

	return <View style={styles.container}>
		<Text style={styles.welcome}>
			Welcome to Universal Ui
		</Text>
		<Text style={styles.instructions}>
			To get started, edit src/welcome.js
		</Text>
		<Text style={styles.instructions}>
			{instructions}
		</Text>
		<Button
			wrapperStyle={styles.buttonWrapper}
			title={`Increase counter [${counter}]`}
			tooltip="Increase counter.."
			tooltipDirection="top"
			onPress={increaseCounter}/>
	</View>;
};

export default Welcome;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
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
	buttonWrapper: {
		backgroundColor: '#00bcd4',
		marginTop: 20,
	},
	buttonIcon: {
		fontSize: 28,
		color: '#ffffff',
	},
});
