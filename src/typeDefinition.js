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

export type Dimension = {
	width?: Number,
	height?: Number,
	scale?: Number,
	fontScale?: Number,
};

export type Dimensions = {
	window?: Dimension,
	screen?: Dimension,
};

export type AccessibilityTrait =
	'none' |
	'button' |
	'link' |
	'header' |
	'search' |
	'image' |
	'selected' |
	'plays' |
	'key' |
	'text' |
	'summary' |
	'disabled' |
	'frequentUpdates' |
	'startsMedia' |
	'adjustable' |
	'allowsDirectInteraction' |
	'pageTurn';

export type AccessibilityComponentType =
	'none' |
	'button' |
	'radiobutton_checked' |
	'radiobutton_unchecked';

export type Corners = {
	top: number,
	left: number,
	bottom: number,
	right: number
};

export type SnappingDirection = 'top' | 'left' | 'bottom' | 'right' | 'top-left' | 'left-top' | 'top-right' | 'right-top' | 'bottom-left' | 'left-bottom' | 'bottom-right' | 'right-bottom' | 'center';

export type PositionOffset = {
	top: Number,
	left: Number,
};

export type DropdownConfigs = {
	component?: any,
	wrapperStyle?: Style,
	containerLayout?: Layout,
	direction: SnappingDirection,
	animatedDirection: SnappingDirection,
	showArrow?: Boolean,
	arrowSize?: Number,
	spacing?: number,
	context?: Object,
	onClose ?: Function,
};

export type RuuiConfigs = {
	button?: {
		styles?: Object,
	},
	modal?: {
		styles?: Object,
		maskProps?: Function,
		containerProps?: Function,
	},
};

export type TooltipConfigs = {
	targetLayout: Layout,
	direction: String,
	positionSpacing?: Number,
	positionOffset?: PositionOffset,
	wrapperStyle?: Style,
	innerStyle?: Style,
	content?: String | Element,
};

export type ModalOptions = {
	id?: String,
	type: "modal" | "dropdown",
	active?: Boolean,
	configs?: {
		zIndex?: Number,
		tapToClose?: Boolean,
		component?: Function | Element,
	},
};
