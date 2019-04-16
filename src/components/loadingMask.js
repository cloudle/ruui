import React, { Component } from 'react';
import { ActivityIndicator, View, TouchableOpacity, StyleSheet } from 'react-native';
import * as appActions from '../utils/store/appAction';

type Props = {
	configs?: Object,
	dispatch?: Function,
};

class RuuiLoadingModal extends Component<any, Props, any> {
	props: Props;

	render() {
		const { configs = {} } = this.props,
			indicatorColor = configs.indicatorColor || '#ffffff',
			indicatorSize = configs.indicatorSize || 'small';

		return <View style={styles.container}>
			<TouchableOpacity onPress={this.onMaskPress}>
				<ActivityIndicator color={indicatorColor} size={indicatorSize}/>
			</TouchableOpacity>
		</View>;
	}

	onMaskPress = () => {
		const { dispatch, configs } = this.props;

		if (configs.tapToClose) {
			dispatch(appActions.toggleLoading(false));
		}
	}
}

export default RuuiLoadingModal;

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0, right: 0, left: 0, bottom: 0,
		alignItems: 'center', justifyContent: 'center',
	},
});
