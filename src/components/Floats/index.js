import React from 'react';
import { StyleSheet, View, Text, } from 'react-native';

import Modal from './Modal';
import { connect, } from '../../utils';
import type { Layout, } from '../../typeDefinition';

type Props = {
	dispatch?: Function,
	floatMap?: Object,
	screenSize?: Layout,
};

const RuuiFloats = (props: Props) => {
	const { dispatch, floatMap, } = props;
	const floats = Object.keys(floatMap).map(key => ({ ...floatMap[key], id: key })).filter(item => item.active);

	return <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
		{floats.map((item) => {
			return <Modal key={item.id} item={item} dispatch={dispatch}/>;
		})}
	</View>;
};

export default connect(({ activeModals }) => {
	return {
		floatMap: activeModals,
	};
})(RuuiFloats);

const styles = StyleSheet.create({
	container: {

	},
});
