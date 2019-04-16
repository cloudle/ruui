import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
	selectorConfigs?: Object,
};

class RuuiPicker extends Component<any, Props, any> {
	props: Props;

	render() {
		return <View>
			{this.renderOptions()}
		</View>;
	}

	renderOptions() {
		const { selectorConfigs } = this.props,
			{ options } = selectorConfigs;

		return options.map((item, i) => {
			return <View key={i}>
				<Text style={styles.optionTitle}>
					{item.title}
				</Text>
			</View>;
		});
	}
}

export default RuuiPicker;

const styles = StyleSheet.create({
	container: {

	},
	optionTitle: {
		color: '#ffffff',
	},
});
