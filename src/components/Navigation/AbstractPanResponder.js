import { PanResponder } from 'react-native';
import invariant from 'fbjs/lib/invariant';

import type {
	NavigationPanPanHandlers,
} from './NavigationTypeDefinition';

const EmptyPanHandlers = {
	onMoveShouldSetPanResponder: null,
	onPanResponderGrant: null,
	onPanResponderMove: null,
	onPanResponderRelease: null,
	onPanResponderTerminate: null,
};

/**
 * Abstract class that defines the common interface of PanResponder that handles
 * the gesture actions.
 */
class NavigationAbstractPanResponder {

	panHandlers: NavigationPanPanHandlers;

	constructor() {
		const config = {};
		Object.keys(EmptyPanHandlers).forEach(name => {
			const fn: any = (this: any)[name];

			invariant(
				typeof fn === 'function',
				'subclass of `NavigationAbstractPanResponder` must implement method %s',
				name
			);

			config[name] = fn.bind(this);
		}, this);

		this.panHandlers = PanResponder.create(config).panHandlers;
	}
}

export default NavigationAbstractPanResponder;
