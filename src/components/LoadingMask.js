import React, { Component } from 'react';
import { ActivityIndicator, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import * as appActions from '../utils/store/appAction';

class LoadingModal extends Component {
  render () {
    return <View
			style={styles.container}>
			<TouchableOpacity onPress={onMaskPress.bind(this)}>
				<ActivityIndicator/>
			</TouchableOpacity>
    </View>
  }
}

function onMaskPress () {
	if (this.props.configs.tapToClose) {
		this.props.dispatch(appActions.toggleLoading(false));
	}
}

const styles = StyleSheet.create({
  container: {
  	position: 'absolute',
		top: 0, right: 0, left: 0, bottom: 0,
		alignItems: 'center', justifyContent: 'center',
	}
});

export default connect(({app}) => {
	return {
		configs: app.loadingConfigs,
	}
})(LoadingModal);