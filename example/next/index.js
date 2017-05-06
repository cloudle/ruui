import React, { Component } from 'react';
import { AsyncStorage, View, Text, StyleSheet } from 'react-native';
import { connect, Provider } from 'react-redux';
import Drawer from 'react-native-drawer';

import { Snackbar } from '../../src';
import Router from './router';
import Menu from './share/menu';
import * as appActions from './store/action/app';

export default function AppContainer({ store }) {
	return <Provider store={store}>
		<App/>
	</Provider>;
}

AppContainer.propTypes = {
	store: React.PropTypes.any,
};

@connect(({ router, app }) => {
	return {
		router,
		counter: app.counter,
	};
})

export class App extends Component {
	static propTypes = {
		dispatch: React.PropTypes.func,
		router: React.PropTypes.any,
	};

	async componentWillMount() {
		const token = await AsyncStorage.getItem('sysConfig');
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		return <Drawer
			type="overlay"
			side="right"
			negotiatePan tapToClose
			panOpenMask={0.2}
			openDrawerOffset={0.2}
			content={<Menu/>}
			tweenHandler={drawerTween}>

			<Router/>
			<Snackbar/>
		</Drawer>;
	}
}

function drawerTween(ratio, side = 'left') {
	return {
		main: { opacity: (2 - ratio) / 1.2 },
		drawer: {
			shadowColor: '#000000',
			shadowOpacity: 0.1 + (ratio * 0.3),
			shadowRadius: ratio * 60,
			elevation: ratio * 50,
		}
	};
}

const styles = StyleSheet.create({
	drawer: {
		backgroundColor: '#000',
	},
	navigator: {

	}
});