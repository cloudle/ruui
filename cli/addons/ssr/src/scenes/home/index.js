import React, { Component } from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity, } from 'react-native';
import { connect } from 'react-redux';
import * as appActions from '../../store/action/app';

const instructions = Platform.select({
	ios: 'Press Cmd+R to reload,\n'
		+ 'Cmd+D or shake for dev menu',
	android: 'Double tap R on your keyboard to reload,\n'
		+ 'Shake or press menu button for dev menu',
	web: 'Command/Control+R to reload your browser :p\n'
		+ '\nAnd in Browser, we have great advantage\nwhen using Chrome Developer Tool\ncompare to the poor native-dev-menu!',
});

type Props = {
	counter?: string,
	dispatch?: Function,
};

class HomeScene extends Component {
	props: Props;

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
			<TouchableOpacity
				style={styles.buttonWrapper}
				onPress={this.increaseCounter}>
				<Text style={styles.buttonText}>
					Increase counter [{this.props.counter}]
				</Text>
			</TouchableOpacity>
			<Text style={styles.link} onPress={this.gotoWelcome}>welcome</Text>
		</View>;
	}

	increaseCounter = () => {
		this.props.dispatch(appActions.increaseCounter());
	};

	gotoWelcome = () => {
		this.props.history.push('/welcome');
	};
}

export default connect(({ app }) => {
	return {
		counter: app.counter,
	};
})(HomeScene);

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
	link: {
		marginTop: 18,
		color: '#00bcd4',
		textDecorationLine: 'underline',
		cursor: 'pointer',
	},
	buttonWrapper: {
		backgroundColor: '#00bcd4',
		padding: 12,
		marginTop: 20,
		borderRadius: 4,
	},
	buttonText: {
		color: '#ffffff',
	},
});
