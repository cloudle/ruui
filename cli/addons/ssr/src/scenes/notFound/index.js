import React, { Component } from 'react';
import { StyleSheet, View, Text, } from 'react-native';

type Props = {

};

class NotFoundScene extends Component {
	props: Props;

	render() {
		return <View style={styles.container}>
			<Text style={styles.text}>404, NotFound</Text>
		</View>;
	}
}

export default NotFoundScene;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		fontSize: 28,
	},
});
