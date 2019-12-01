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

export type Route = {
	component: any,
	path?: String,
	exact?: Boolean,
	routes?: Array<Route>,
};

export type RouterLocation = {
	pathname?: String,
	search?: String,
	hash?: String,
	state?: any,
};

export type RouterMatch = {
	path?: String,
	url?: String,
	isExact?: Boolean,
	params?: Object,
};

export type RouterHistory = {
	action?: String,
	block?: Function,
	listen?: Function,
	go?: Function,
	goBack?: Function,
	goForward?: Function,
	length?: Number | String,
	push?: Function,
	replace?: Function,
	location?: RouterLocation,
};
