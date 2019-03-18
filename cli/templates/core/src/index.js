import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { RuuiProvider, Button, Tooltip } from 'react-universal-ui';
import { hot } from 'react-hot-loader/root';

const instructions = Platform.select({
	ios: 'Press Cmd+R to reload,\n'
		+ 'Cmd+D or shake for dev menu',
	android: 'Double tap R on your keyboard to reload,\n'
		+ 'Shake or press menu button for dev menu',
	web: 'Command/Control+R to reload your browser :p\n'
		+ '\nAnd in Browser, we have great advantage\nwhen using Chrome Developer Tool\ncompare to the poor native-dev-menu!',
});

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			counter: 0,
		};
	}

	render() {
		return <View style={styles.container}>
			<Text style={styles.welcome}>
				Welcome to Universal Ui
			</Text>
			<Text style={styles.instructions}>
				To get started, edit src/index.js
			</Text>
			<Text style={styles.instructions}>
				{instructions}
			</Text>
			<Button
				wrapperStyle={styles.buttonWrapper}
				title={`Increase counter [${this.state.counter}]`}
				tooltip="Increase counter.."
				tooltipDirection="top"
				onPress={this.increaseCounter}/>
		</View>;
	}

	increaseCounter = () => {
		this.setState({ counter: this.state.counter + 1 });
	};
}

function AppContainer(props) {
	return <RuuiProvider>
		<App/>

		<Tooltip/>
	</RuuiProvider>;
}

export default hot(AppContainer);

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
