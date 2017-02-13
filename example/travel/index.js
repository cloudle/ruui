import React, { Component } from 'react';
import { AsyncStorage, StatusBar, View, Text, StyleSheet } from 'react-native';
import { Provider } from 'react-redux';

import { connect } from 'react-redux';
import { NavigationExperimental, Modal, utils } from '../../src';
import { nativeRouteAction } from '../../src/utils/route';
import Drawer from 'react-native-drawer';
import Menu from './share/Menu';
import NavigationHeader from './share/NavigationHeader';
import * as appActions from './store/action/app';

const { isIos, isAndroid } = utils;

@connect(({router, app}) => {
	return {
		router,
		counter: app.counter,
	}
})

export class App extends Component {
	async componentWillMount () {
		if (isIos) {
			StatusBar.setBarStyle('light-content', true);
		} else if (isAndroid) {
			StatusBar.setBackgroundColor('transparent');
			StatusBar.setTranslucent(true);
		}

		let token = await AsyncStorage.getItem('sysConfig');
	}

	render () {
		const navigationState = this.props.router,
			activeRoute = navigationState.routes[navigationState.index],
			transitionDirection = activeRoute.transitionDirection || 'horizontal';

		return <Drawer
			type="overlay"
			side="right"
			negotiatePan={true}
			panOpenMask={0.2}
			tapToClose={true}
			openDrawerOffset={0.2}
			content={<Menu/>}
			tweenHandler={drawerTween}>

			<NavigationExperimental.CardStack
				direction={transitionDirection}
				style={styles.navigator}
				navigationState={navigationState}
				renderScene={this::renderScene}
				renderHeader={this::renderHeader}
				gestureResponseDistance={50}
				onNavigateBack={() => this.props.dispatch(nativeRouteAction.pop())}/>
		</Drawer>
	}
}

function renderScene (props) {
	const activeRoute = props.scene.route,
		Scene = activeRoute.component;

	return <View style={[styles.sceneWrapper, activeRoute.style]}>
		<Scene/>
		<Modal/>
	</View>
}

function renderHeader (sceneProps) {
	if (!sceneProps.scene.route.hideNavigation) {
		return <NavigationHeader {...sceneProps}/>
	}
}

function drawerTween (ratio, side = 'left') {
	return {
		main: {
			opacity:(2-ratio)/1.2,
		},
		drawer: {
			shadowColor: '#000000',
			shadowOpacity: 0.1 + (ratio * 0.3),
			shadowRadius: ratio * 60,
			elevation: ratio * 50,
		}
	}
}

const styles = StyleSheet.create({
	drawer: {
		backgroundColor: '#000',
	},
	navigator: {
		flex: 1,
	},
	sceneWrapper: {
		flex: 1,
	}
});

export default function AppContainer ({store}) {
	return <Provider store={store}>
		<App/>
	</Provider>
}