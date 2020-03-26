import React from 'react';
import { StyleSheet, View, Text, } from 'react-native';
import { Style, Element, } from '../../typeDefinition';

type Props = {

};

function Ripple(props: Props) {
	return <View style={styles.container}>
		<Text>Ripple</Text>
	</View>;
}

export default Ripple;

const styles = StyleSheet.create({
	container: {
		flex: 1, alignItems: 'center', justifyContent: 'center',
	},
});
