import React, { Component } from 'react';
import { ActivityIndicator, View, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import * as appActions from '../utils/store/appAction';

type Props = {
	configs?: Object,
	dispatch?: Function,
};

export default class LoadingModal extends Component<any, Props, any> {
	props: Props;

	render() {
		const configs = this.props.configs || {},
			indicatorColor = configs.indicatorColor || '#ffffff',
			indicatorSize = configs.indicatorSize || 20;

		return <View
			style={styles.container}>
			<TouchableOpacity onPress={this.onMaskPress}>
				<ActivityIndicator color={indicatorColor} size={indicatorSize}/>
			</TouchableOpacity>
    </View>;
	}

	onMaskPress = () => {
		if (this.props.configs.tapToClose) {
			this.props.dispatch(appActions.toggleLoading(false));
		}
	}
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0, right: 0, left: 0, bottom: 0,
		alignItems: 'center', justifyContent: 'center',
	},
});