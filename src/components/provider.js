import React from 'react';
import { StyleSheet, View, Text, } from 'react-native';

import { RuuiContext, ruuiStore, } from '../utils/context';
import type { Element, } from '../typeDefinition';

type Props = {
	store?: Object,
	children?: Element,
};

function Provider(props: Props) {
	const { children, store, } = props;
	const safeStore = store || ruuiStore;

	return <RuuiContext.Provider value={safeStore}>
		{children}
	</RuuiContext.Provider>;
}

export default Provider;

const styles = StyleSheet.create({
	container: {

	},
});
