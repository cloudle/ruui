import React, { Component } from 'react';
import { StyleSheet } from 'react-native';

import { colors } from '../utils';
import { NavigationExperimental } from '../../../src';
import NavigationBackButton from './NavigationBackButton';

const { Header: NavigationHeader } = NavigationExperimental;

export default class Header extends Component {
	render() {
		return <NavigationHeader
			{...this.props}
			style={styles.navigationContainer}
			renderTitleComponent={this.renderTitleComponent}
			renderLeftComponent={this.renderLeftComponent}/>;
	}

	renderTitleComponent = (props) => {
		return <NavigationHeader.Title
				textStyle={styles.navigationTitle}>
			{props.scene.route.key}
		</NavigationHeader.Title>;
	};

	renderLeftComponent = (props) => {
		return props.scene.index === 0 ?
			null : <NavigationBackButton onPress={this.onNavigateBack}/>;
	};

	onNavigateBack = () => {
		console.log('Back!');
	}
}

const styles = StyleSheet.create({
	navigationContainer: {
		backgroundColor: colors.main,
		borderBottomColor: colors.main,
	},
	navigationTitle: {
		color: 'white',
	}
});