import React, { Component } from 'react';
import { View, StyleSheet, } from 'react-native';

import Modal from './modal';
import RuuiDropdown from './dropdown';
import { connect } from '../utils';

type Props = {
	preRenders?: Array<Object>,
	preRenderDelay?: Number,
	modals?: Array<Object>,
	dispatch?: Function,
	screenSize?: { width?: number, height?: number },
	animationDelay?: Number,
};

class RuuiModals extends Component {
	props: Props;
	static defaultProps = {
		animationDelay: 200,
		preRenderDelay: 300,
	};

	componentDidMount() {
		const { dispatch, preRenders, preRenderDelay, } = this.props;

		if (preRenders?.length) {
			for (let i = 0; i < preRenders.length; i += 1) {
				const item = preRenders[i];
				item.flag = false;
				setTimeout(() => dispatch(item), i * preRenderDelay);
			}
		}
	}

	render() {
		const { dispatch, modals, screenSize, animationDelay, } = this.props,
			modalArray = Object.keys(modals).map(key => Object.assign({}, modals[key], { id: key }));

		return <View
			ref={(ref) => { global.modalsContainer = ref; }}
			pointerEvents="box-none"
			style={styles.container}>
			{modalArray.map((modalConfigs, i) => {
				if (modalConfigs.type === 'dropdown') {
					return <RuuiDropdown
						key={i}
						screenSize={screenSize}
						{...modalConfigs}
					/>;
				}
				return <Modal
					key={i}
					modalCount={modalArray.filter(e => e.type !== 'dropdown').length}
					dispatch={dispatch}
					animationDelay={animationDelay}
					{...modalConfigs}/>;
			})}
		</View>;
	}
}

export default connect(({ activeModals }) => {
	return {
		modals: activeModals,
	};
})(RuuiModals);

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0, left: 0, right: 0, bottom: 0,
	},
});
