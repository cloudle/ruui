import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, } from 'react-native';

import * as appActions from '../store/action/app';
import type { Element, SnappingDirection, Style } from '../typeDefinition';

type Props = {
	children?: Element,
	tooltip?: String | Element,
	tooltipWrapperStyle?: Style,
	tooltipInnerStyle?: Style,
	tooltipDirection?: SnappingDirection,
	tooltipPositionSpacing?: number,
	tooltipPositionOffset?: Object,
};

class TooltipContainer extends Component {
	props: Props;

	static contextTypes = {
		ruuiStore: PropTypes.object,
	};

	constructor(props) {
		super(props);
		this.state = {
			mouseInside: false,
		};
	}

	render() {
		const {
			tooltip,
			tooltipWrapperStyle,
			tooltipInnerStyle,
			tooltipDirection,
			tooltipPositionSpacing,
			tooltipPositionOffset,
			children, ...otherProps } = this.props;

		return <View
			ref={(instance) => { this.wrapperView = instance }}
			onMouseEnter={this.onMouseEnter}
			onMouseLeave={this.onMouseLeave}
			collapsable={false}
			{...otherProps}>
			{children}
		</View>;
	}

	onMouseEnter = () => {
		const { ruuiStore, } = this.context;
		const { tooltip, tooltipWrapperStyle, tooltipInnerStyle, tooltipDirection, tooltipPositionSpacing, tooltipPositionOffset } = this.props;

		if (tooltip) {
			this.wrapperView.measure((x, y, width, height, pageX, pageY) => {
				ruuiStore.dispatch(appActions.toggleTooltip(true, {
					targetLayout: { x: pageX, y: pageY, width, height },
					direction: tooltipDirection,
					positionSpacing: tooltipPositionSpacing,
					positionOffset: tooltipPositionOffset,
					content: tooltip,
					wrapperStyle: tooltipWrapperStyle,
					innerStyle: tooltipInnerStyle,
				}));
			});
		}
	};

	onMouseLeave = () => {
		const { ruuiStore } = this.context;
		const { tooltip } = this.props;

		if (tooltip) {
			ruuiStore.dispatch(appActions.toggleTooltip(false));
		}
	};
}

export default TooltipContainer;
