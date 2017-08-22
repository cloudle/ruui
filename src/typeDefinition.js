import React from 'react';

export type Action = {
	action: String,
}

export type Element = React.Element<*>;

export type Style =
	| { [key: string]: any }
	| number
	| false
	| null
	| void
	| Array<Style>;

export type LayoutEvent = {
	nativeEvent: {
		layout: {
			x: number,
			y: number,
			width: number,
			height: number,
		},
	},
};

export type SnappingDirection = 'top' | 'left' | 'bottom' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type DropdownConfigs = {
	component?: any,
	wrapperStyle?: Style,
	direction: SnappingDirection,
	spacing?: number,
	position?: {
		left: number, top: number,
	},
	context?: Object,
};