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

export type Layout = {
	x: number,
	y: number,
	width: number,
	height: number,
};

export type LayoutEvent = {
	nativeEvent: {
		layout: Layout,
	},
};

export type SnappingDirection = 'top' | 'left' | 'bottom' | 'right' | 'top-left' | 'left-top' | 'top-right' | 'right-top' | 'bottom-left' | 'left-bottom' | 'bottom-right' | 'right-bottom';

export type INavigation = {
	addListener?: Function,
	canGoBack?: Function,
	dispatch?: Function,
	goBack?: Function,
	isFocused?: Function,
	navigate?: Function,
	pop?: Function,
	popToTop?: Function,
	push?: Function,
	removeListener?: Function,
	replace?: Function,
	reset?: Function,
	setOptions?: Function,
	setParams?: Function,
};

export type IRoute = {
	key?: string,
	name?: string,
	params?: Object,
};
