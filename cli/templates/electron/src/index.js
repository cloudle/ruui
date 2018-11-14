import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { utils, RuuiProvider, Button, Tooltip } from 'react-universal-ui';
import { connect, Provider } from 'react-redux';
import { hot } from 'react-hot-loader';

import { store } from './store';
import * as appActions from './store/action/app';

const instructions = Platform.select({
	ios: 'Press Cmd+R to reload,\n' +
	'Cmd+D or shake for dev menu',
	android: 'Double tap R on your keyboard to reload,\n' +
	'Shake or press menu button for dev menu',
	web: 'Command/Control+R to reload your browser :p\n' +
	'\nAnd in Browser, we have great advantage\nwhen using Chrome Developer Tool\ncompare to the poor native-dev-menu!',
});

type Props = {
	counter?: string,
	dispatch?: Function,
};

@connect(({ app }) => {
	return {
		counter: app.counter,
	};
})

class App extends Component {
	props: Props;

	render() {
		return <View style={styles.container}>
			<Text style={styles.welcome}>
				Welcome to Universal Ui on Electron
			</Text>
			<Text style={styles.instructions}>
				To get started, edit src/index.js
			</Text>
			<Text style={styles.instructions}>
				{instructions}
			</Text>
			<Text style={styles.extraNote}>
				By the way, Node.js (version is {process.versions.node}) detected{'\n'}
				we could use it in an Electron project
			</Text>
			<Button
				wrapperStyle={styles.buttonWrapper}
				title={`Increase counter [${this.props.counter}]`}
				tooltip="Increase counter.."
				tooltipDirection="top"
				onPress={this.increaseCounter}/>
		</View>;
	}

	increaseCounter = () => {
		this.props.dispatch(appActions.increaseCounter());
	};
}

function AppContainer(props) {
	return <RuuiProvider>
		<Provider store={store}>
			<App/>
		</Provider>

		<Tooltip/>
	</RuuiProvider>;
}

export default hot(module)(AppContainer);

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
		marginBottom: 20,
	},
	extraNote: {
		textAlign: 'center',
		color: '#888888',
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

