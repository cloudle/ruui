import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { TabView } from '../../../src';

const FirstRoute = () => <View style={[styles.container, { backgroundColor: '#ff4081' }]} />;
const SecondRoute = () => <View style={[styles.container, { backgroundColor: '#673ab7' }]} />;

export default class IntroScene extends Component {
	constructor(props) {
		super(props);
		this.state = {
			index: 0,
			routes: [
				{ key: '1', title: 'First' },
				{ key: '2', title: 'Second' },
			],
		};
	}

	render() {
		return <TabView.TabViewAnimated
			style={styles.container}
			navigationState={this.state}
			renderScene={this.renderScene}
			renderHeader={this.renderHeader}
			onRequestChangeTab={this.handleChangeTab}
		/>;
	}

	handleChangeTab = index => this.setState({ index });
	renderHeader = props => <TabView.TabBar {...props} />;
	renderScene = TabView.SceneMap({
		1: FirstRoute,
		2: SecondRoute,
	});
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});