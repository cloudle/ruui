import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { routeAction } from '../../../src/utils';

import { Button } from '../../../src';
import * as appActions from '../store/action/app';
import * as routes from '../utils/routes';

type Props = {
	dispatch?: Function,
};

@connect(({ app }) => {
	return {
		counter: app.counter,
	};
})

export default class app extends Component {
	props: Props;

	render() {
		return <View style={styles.container}>
			<Text style={styles.welcome}>
				Welcome to React Native!! {this.props.counter}
			</Text>
			<Text style={styles.instructions}>
				To get started, edit src/app.js
			</Text>
			<Text style={styles.instructions}>
				Press Cmd+R to reload,{'\n'}
				Cmd+D or shake for dev menu
			</Text>
			<Button
				wrapperStyle={{ backgroundColor: '#00bcd4', width: 120 }}
				tooltip="Yay!"
				title="Click me!" onPress={() => {
					this.props.dispatch(routeAction.push(routes.login));
				}}/>
		</View>;
	}
}

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
});