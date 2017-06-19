/* @flow */

import React, { PureComponent, Children } from 'react';
import { View, ViewPagerAndroid, StyleSheet, I18nManager } from 'react-native';
import type { SceneRendererPropType } from './TabViewPropTypes';
import type { SceneRendererProps, Route } from './TabViewTypeDefinitions';

type PageScrollEvent = {
	nativeEvent: {
		position: number,
		offset: number,
	},
};

type PageScrollState = 'dragging' | 'settling' | 'idle';

type Props<T> = SceneRendererProps<T> & {
	animationEnabled?: boolean,
	swipeEnabled?: boolean,
	children?: React.Element<any>,
};

export default class TabViewPagerAndroid<T: Route<*>>
	extends PureComponent<void, Props<T>, void> {
	props: Props;

	constructor(props: Props<T>) {
		super(props);
		this.currentIndex = this.props.navigationState.index;
	}

	componentDidMount() {
		this.resetListener = this.props.subscribe('reset', this.handlePageChange);
	}

	componentWillReceiveProps(nextProps: Props<T>) {
		if (
			this.props.layout !== nextProps.layout ||
			Children.count(this.props.children) !== Children.count(nextProps.children)
		) {
			global.requestAnimationFrame(() => {
				if (this.viewPager) {
					const { navigationState } = nextProps;
					const page = I18nManager.isRTL
						? navigationState.routes.length - (navigationState.index + 1)
						: navigationState.index;

					this.viewPager.setPageWithoutAnimation(page);
				}
			});
		}
	}

	componentDidUpdate() {
		this.handlePageChange(this.props.navigationState.index);
	}

	componentWillUnmount() {
		this.resetListener.remove();
	}

	resetListener: Object;
	viewPager: Object;
	isIdle: boolean = true;
	currentIndex = 0;

	getPageIndex = (index: number) =>
		(I18nManager.isRTL ? this.props.navigationState.routes.length - (index + 1) : index);

	setPage = (index: number) => {
		if (this.viewPager) {
			const page = this.getPageIndex(index);
			if (this.props.animationEnabled !== false) {
				this.viewPager.setPage(page);
			} else {
				this.viewPager.setPageWithoutAnimation(page);
			}
		}
	};

	handlePageChange = (index: number) => {
		if (this.isIdle && this.currentIndex !== index) {
			this.setPage(index);
			this.currentIndex = index;
		}
	};

	handlePageScroll = (e: PageScrollEvent) => {
		this.props.position.setValue(
			this.getPageIndex(e.nativeEvent.position)
				+ (e.nativeEvent.offset * (I18nManager.isRTL ? -1 : 1)),
		);
	};

	handlePageScrollStateChanged = (e: PageScrollState) => {
		this.isIdle = e === 'idle';
		this.props.jumpToIndex(this.currentIndex);
	};

	handlePageSelected = (e: PageScrollEvent) => {
		this.currentIndex = this.getPageIndex(e.nativeEvent.position);
	};

	setRef = (el: Object) => (this.viewPager = el);

	render() {
		const { children, navigationState, swipeEnabled } = this.props;
		const content = Children.map(children, (child, i) => (
			<View
				key={navigationState.routes[i].key}
				testID={navigationState.routes[i].testID}
				style={styles.page}
			>
				{child}
			</View>
		));

		if (I18nManager.isRTL) {
			content.reverse();
		}

		const initialPage = this.getPageIndex(navigationState.index);

		return (
			<ViewPagerAndroid
				key={navigationState.routes.length}
				keyboardDismissMode="on-drag"
				initialPage={initialPage}
				scrollEnabled={swipeEnabled !== false}
				onPageScroll={this.handlePageScroll}
				onPageScrollStateChanged={this.handlePageScrollStateChanged}
				onPageSelected={this.handlePageSelected}
				style={styles.container}
				ref={this.setRef}
			>
				{content}
			</ViewPagerAndroid>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
	},

	page: {
		overflow: 'hidden',
	},
});
