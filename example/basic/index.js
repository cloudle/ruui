import React, { Component } from 'react';
import { AsyncStorage, View, Text, StyleSheet } from 'react-native';
import { connect, Provider } from 'react-redux';

import { NavigationExperimental, Snackbar } from '../../src';
import Drawer from 'react-native-drawer';
import Menu from './share/Menu';
import NavigationHeader from './share/NavigationHeader';
import Welcome from './scenes/welcome';
import * as appActions from './store/action/app';

export default function AppContainer ({store}) {
	return <Provider store={store}>
		<App/>
	</Provider>
}

@connect(({router, app}) => {
	return {
		router,
		counter: app.counter,
	}
})

export class App extends Component {
	async componentWillMount () {
		let token = await AsyncStorage.getItem('sysConfig');
		if (module.hot) {
			this.interval = setInterval(() => {
				this.props.dispatch(appActions.increaseCounter());
			}, 100);
		}
	}

	componentWillUnmount () {
		clearInterval(this.interval);
	}

	render () {
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
				style={styles.navigator}
				navigationState={this.props.router}
				renderScene={this::renderScene}
				renderHeader={this::renderHeader}
				gestureResponseDistance={50}
				onNavigateBack={() => console.log('Back..')}/>

			{/*<Snackbar/>*/}
		</Drawer>
	}
}

function renderScene (props) {
		const Scene = props.scene.route.component;
		return <Scene/>
}

function renderHeader (sceneProps) {
	return <NavigationHeader {...sceneProps}/>
}

function drawerTween (ratio, side = 'left') {
	return {
		main: { opacity:(2-ratio)/1.2 },
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

	}
});