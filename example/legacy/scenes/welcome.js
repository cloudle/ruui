import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Slider from 'react-native-slider';
import Icon from 'react-native-vector-icons/Ionicons';

import { Button, Input, Select, appAction, routeAction } from '../../../src';
import GreetingModal from '../modal/greeting';
import GoodByeModal from '../modal/goodbye';
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

	constructor(props) {
		super(props);
		this.state = {
			activeSelect: selects[0],
			sliderValue: 0.5,
		};
	}

	render() {
		return <View style={styles.container}>
			<View style={{ flexDirection: 'row', }}>
				<View style={{ flex: 1, flexBasis: 0, }}>
					<Input forceFloating floatingLabel="Hello"/>
				</View>
				<View style={{ flex: 1, flexBasis: 0, }}>
					<Select
						options={selects}
						value={this.state.activeSelect}
						onSelect={next => this.setState({ activeSelect: next })}/>
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
				<View style={{ width: 200, height: 50, }}>
					<Slider
						value={this.state.sliderValue}
						onValueChange={value => this.setState({ sliderValue: value })} />
				</View>
				<Button
					wrapperStyle={{ backgroundColor: '#00bcd4', width: 120, }}
					tooltip="Yay!"
					title="Click me!" onPress={() => {
						// this.props.dispatch(routeAction.push('Login'));
						// this.props.dispatch(appAction.insertSnackBar({
						// 	contentRenderer: () => {
						// 		return <Text>Dou ma</Text>;
						// 	},
						// 	message: 'Hello',
						// 	containerStyle: {
						// 		backgroundColor: 'red',
						// 	},
						// }));
						// this.props.dispatch(appAction.toggleModal(true, {
						// 	component: GreetingModal,
						// 	tapToClose: true,
						// 	// fullScreen: true,
						// }));
						// this.props.dispatch(appAction.toggleModal(true, { component: GreetingModal }));
						// setTimeout(() => {
						// 	this.props.dispatch(appAction.toggleModal(true, {
						// 		id: 'goodBye',
						// 		component: GoodByeModal,
						// 	}));
						// }, 2000);
						//
						// setTimeout(() => {
						// 	this.props.dispatch(appAction.toggleModal(false, { id: 'goodBye', }));
						// }, 3000);
						//
						// setTimeout(() => {
						// 	this.props.dispatch(appAction.toggleModal(false));
						// }, 4000);
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