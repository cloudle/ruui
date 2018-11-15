import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, } from 'react-native';
import { connect } from 'react-redux';
import * as appActions from '../../store/action/app';

type Props = {
	counter?: Number,
};

@connect(({ app }) => {
	return {
		counter: app.counter,
	};
})

export default class WelcomeScene extends Component {
	props: Props;

	render() {
		return <View style={styles.container}>
			<Text style={styles.welcome}>Welcome Scene</Text>
			<Text style={styles.instructions}>
				Server side rendering, redux and react-hot-loader{'\n'}work perfectly with Routing ;)
			</Text>
			<TouchableOpacity
				style={styles.buttonWrapper}
				onPress={this.increaseCounter}>
				<Text style={styles.buttonText}>
					Increase counter [{this.props.counter}]
				</Text>
			</TouchableOpacity>
			<Text style={styles.link} onPress={this.gotoHome}>home</Text>
		</View>;
	}

	increaseCounter = () => {
		this.props.dispatch(appActions.increaseCounter());
	};

	gotoHome = () => {
		this.props.history.push('/');
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1, alignItems: 'center', justifyContent: 'center',
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
