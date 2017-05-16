import React, { Component } from 'react';
import { StatusBar, View, Text, StyleSheet } from 'react-native';
import { connect, Provider } from 'react-redux';
import Drawer from 'react-native-drawer';

import { Snackbar, Modal, utils } from '../../src';
import Router from './router';
import Menu from './share/menu';
import * as appActions from './store/action/app';

const { isIos, isAndroid } = utils;

type ContainerProps = {
	store?: any,
};

export default function AppContainer(props: ContainerProps) {
	const { store } = props;
	return <Provider store={store}>
		<App/>
	</Provider>;
}

type Props = {
	dispatch?: Function,
	router?: any,
};

@connect(({ router, app }) => {
	return {
		router,
		counter: app.counter,
	};
})

export class App extends Component {
	props: Props;

	async componentWillMount() {
		if (isIos) {
			StatusBar.setBarStyle('light-content', true);
		} else if (isAndroid) {
			StatusBar.setBackgroundColor('transparent');
			StatusBar.setTranslucent(true);
		}
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
			<Modal/>
			{/*<Snackbar/>*/}
		</Drawer>;
	}
}

function drawerTween(ratio, side = 'left') {
	const androidStyle = isAndroid ? {
		elevation: ratio * 50,
	} : {};

	return {
		main: { opacity: (2 - ratio) / 1.2 },
		drawer: {
			shadowColor: '#000000',
			shadowOpacity: 0.1 + (ratio * 0.3),
			shadowRadius: ratio * 60,
			...androidStyle,
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