import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';

import { Button, Input, Select, appAction, routeAction } from '../../../src';
import GreetingModal from '../modal/greeting';
import * as appActions from '../store/action/app';

type Props = {
	dispatch?: Function,
	counter?: number,
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
			<View style={{ flexDirection: 'row', }}>
				<View style={{ flex: 1, flexBasis: 0, }}>
					<Input forceFloating floatingLabel="Hello"/>
				</View>
				<View style={{ flex: 1, flexBasis: 0, }}>
					<Select options={selects} value={{ title: 'None', }}/>
				</View>
			</View>

			<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
					wrapperStyle={{ backgroundColor: '#00bcd4', width: 120, borderRadius: 6, }}
					tooltip="Yay!"
					title="Click me!" onPress={() => {
						this.props.dispatch(appAction.toggleModal(true, {
							Component: GreetingModal,
						}));
					}}/>
			</View>
		</View>;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		// justifyContent: 'center',
		// alignItems: 'center',
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

const selects = [{
	title: 'Selection 1',
}, {
	title: 'Selection 2',
}, {
	title: 'Selection 3',
}, {
	title: 'Selection 4',
}];