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
