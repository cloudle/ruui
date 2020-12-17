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

export type SnappingDirection = 'top' | 'left' | 'bottom' | 'right' | 'top-left' | 'left-top' | 'top-right' | 'right-top' | 'bottom-left' | 'left-bottom' | 'bottom-right' | 'right-bottom';
