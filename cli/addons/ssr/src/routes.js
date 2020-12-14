import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';

import HomeScene from './scenes/home';
import WelcomeScene from './scenes/welcome';
import NotFound from './scenes/notFound';
import type { Route, } from './typeDefinition';

type Props = {
	dispatch?: Function,
	route: Route,
	location?: Object,
	history?: Object,
};

class Layout extends Component {
	props: Props;

	render() {
		return <View style={styles.container}>
			{renderRoutes(this.props.route.routes)}
		</View>;
	}
}

const ConnectedLayout = connect(({ app }) => {
	return {

	};
})(Layout);

const styles = StyleSheet.create({
	container: {
		flex: 1, flexDirection: 'row',
	},
});

export default [{
	component: ConnectedLayout,
	routes: [{
		path: '/',
		exact: true,
		component: HomeScene,
	}, {
		path: '/welcome',
		exact: true,
		component: WelcomeScene,
	}, {
		component: NotFound,
	}, ],
}];
