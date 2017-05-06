import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tinyColor from 'tinycolor2';

import { Button, Input } from '../../../src';
import { colors } from '../utils';

export default class Menu extends Component {
	render() {
		return <View style={styles.container}>
			<View style={styles.spacer}/>
			{this.renderHeader()}
			{this.renderMenu()}
		</View>;
	}

	renderHeader = () => {
		return <View style={styles.heading}>
			<View style={styles.headingAvatar}>
				<View style={styles.avatar}/>
			</View>
			{this.renderAccount()}
		</View>;
	};

	renderAccount = () => {
		return <View style={styles.headingAccount}>
			<Text style={styles.headingText}>Cloud Le</Text>
			<Text style={styles.headingText}>lehaoson@gmail.com</Text>
			<Text style={styles.headingText}>traveller</Text>
			<Button
				title="LOGOUT"
				textStyle={{ fontSize: 11, fontWeight: '500' }}
				wrapperStyle={{
					marginTop: 6,
					width: 100,
					borderWidth: 1,
					borderColor: '#FFFFFF',
					borderStyle: 'solid',
					borderRadius: 2 }}
				innerStyle={{
					padding: 2,
				}}/>
		</View>;
	};

	renderMenu = () => {
		return <View style={styles.menu}>
			<Text>Menu</Text>
		</View>;
	};
}

const avatarSize = 72;
const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	spacer: {
		height: 24,
		backgroundColor: colors.darkerMain
	},
	heading: {
		flexDirection: 'row',
		backgroundColor: tinyColor(colors.main).darken(5).toHexString(),
		height: 120,
	},
	headingAvatar: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	avatar: {
		width: avatarSize,
		height: avatarSize,
		borderRadius: avatarSize/2,
		backgroundColor: 'white',
		margin: 15,
	},
	headingAccount: {
		flex: 1,
		justifyContent: 'center',
	},
	headingText: {
		color: '#FFFFFF'
	},
	menu: {
		flex: 1,
		backgroundColor: '#FFFFFF',
	}
});