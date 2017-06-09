import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Style } from '../typeDefinition';

type Props = {
	closeable?: boolean,
	timeout?: number,
	onTimeout?: Function,
	configs?: Object,
};

export default class Snackbar extends Component {
	props: Props;

	static defaultProps = {
		contentRenderer: defaultContentRenderer,
		timeout: 10000,
	};

	componentDidMount() {
		if (this.props.onTimeout) {
			this.timeout = setTimeout(() => {
				this.props.onTimeout(this.props.configs);
			}, this.props.timeout);
		}
	}

	render() {
		const contentRenderer = this.props.configs.contentRenderer || defaultContentRenderer;

		return <View style={[styles.container, this.props.configs.containerStyle]}>
			{contentRenderer(this.props.configs)}
		</View>;
	}
}

function defaultContentRenderer(configs) {
	return <Text
		numberOfLines={1}
		style={styles.message}>{configs.message}</Text>;
}

const styles = StyleSheet.create({
	container: {
		padding: 14, marginTop: 6,
		borderRadius: 3,
		backgroundColor: 'rgba(20, 20 , 20, 0.8)',
	},
	message: {
		color: '#ffffff',
	},
});