import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
	selectorConfigs?: Object,
};

export default class Picker extends Component<any, Props, any> {
	props: Props;

	render() {
		return <View>
			{this.renderOptions()}
		</View>;
	}

	renderOptions() {
		const { options } = this.props.selectorConfigs;

		return options.map((item, i) => {
			return <View key={i}>
				<Text style={styles.optionTitle}>
					{item.title}
				</Text>
			</View>;
		});
	}
}

const styles = StyleSheet.create({
	container: {

	},
	optionTitle: {
		color: '#ffffff',
	},
});