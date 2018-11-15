import React, { Component } from 'react';
import { utils, RuuiProvider, Button, Tooltip } from 'react-universal-ui';
import { Provider } from 'react-redux';
import { Router, MemoryRouter, StaticRouter } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import { hot } from 'react-hot-loader';

import routes from './routes';
import { store } from './store';

type ContainerProps = {
	ssrLocation?: string,
	ssrContext?: Object,
};

function AppContainer(props: ContainerProps) {
	const routerAndProps = getRouterAndProps(props),
		{ component: Router, props: routerProps  } = routerAndProps;

	return <RuuiProvider>
		<Provider store={store}>
			<Router {...routerProps}>
				{renderRoutes(routes)}
			</Router>
		</Provider>

		<Tooltip/>
	</RuuiProvider>;
}

export default hot(module)(AppContainer);

function getRouterAndProps(props: ContainerProps) {
	if (utils.isServer) {
		return {
			component: StaticRouter,
			props: {
				location: props.ssrLocation,
				context: props.ssrContext,
			}
		};
	} else if (utils.isWeb) {
		return {
			component: BrowserRouter,
			props: {},
		};
	} else {
		return {
			component: MemoryRouter,
			props: {},
		};
	}
}
