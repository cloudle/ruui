import React, { Component } from 'react';
import { AsyncStorage, View, Text, StyleSheet } from 'react-native';
import { connect, Provider } from 'react-redux';
import Drawer from 'react-native-drawer';

import { ContextProvider, ConnectionMask, NavigationCardStack, Snackbar, Modal, routeAction, appAction } from '../../src';
import Menu from './share/Menu';
import NavigationHeader from './share/NavigationHeader';
import Welcome from './scenes/welcome';
import * as appActions from './store/action/app';

export default function AppContainer({ store }) {
	return <ContextProvider store={store}>
		<App/>
	</ContextProvider>;
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

	render() {
		return <Drawer
			type="overlay"
			side="right"
			negotiatePan tapToClose
			panOpenMask={0.2}
			openDrawerOffset={0.2}
			content={<Menu/>}
			tweenHandler={drawerTween}>

			<NavigationCardStack
				style={styles.navigator}
				navigationState={this.props.router}
				renderScene={this.renderScene}
				renderHeader={this.renderHeader}
				gestureResponseDistance={50}
				onNavigateBack={() => this.props.dispatch(routeAction.pop())}/>

			<Snackbar/>
			<Modal/>
			<ConnectionMask/>
		</Drawer>;
	}

	renderScene = (props) => {
		const Scene = props.scene.route.component;
		return <Scene/>;
	};

	renderHeader = (sceneProps) => {
		return <NavigationHeader {...sceneProps}/>;
	};
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