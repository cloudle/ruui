import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type Props = {
	context?: Object,
};

export default class ContextMenu extends Component {
	props: Props;

	render() {
		return <View style={styles.container}>
			{menuItems.map((item, i) => {
				const lastItemStyle = i == menuItems.length - 1 && { borderBottomWidth: 0 };
				return <View
					key={i}
					style={[{
						padding: 8,
						borderBottomWidth: 1, borderColor: '#e0e0e0', }, lastItemStyle]}>
					<Text>{this.props.context.name} {item.title}</Text>
				</View>;
			})}
		</View>;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

const menuItems = [
	{ title: 'Item 01', },
	{ title: 'Item 02', },
	{ title: 'Item 03', },
	{ title: 'Item 04', },
	{ title: 'Item 05', },
];
