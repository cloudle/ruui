import React, { Component } from 'react';
import { ActivityIndicator, View, TouchableOpacity, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import * as appActions from '../utils/store/appAction';

@connect(({ app }) => {
	return {
		configs: app.loadingConfigs,
	};
})

export default class LoadingModal extends Component {
	static propTypes = {
		configs: React.PropTypes.any,
		dispatch: React.PropTypes.func,
	};

	render() {
		return <View
			style={styles.container}>
			<TouchableOpacity onPress={this.onMaskPress}>
				<ActivityIndicator/>
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