import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';

import { colors } from '../utils';
import { NavigationHeader, utils } from '../../../src';
import NavigationBackButton from './NavigationBackButton';

@connect(({ app }) => {
	return {

	};
})

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
		this.props.dispatch(utils.routeAction.pop());
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