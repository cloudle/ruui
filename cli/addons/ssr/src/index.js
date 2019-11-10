import React, { Component } from 'react';
import { utils, RuuiProvider, Button, Tooltip } from 'react-universal-ui';
import { Provider } from 'react-redux';
import { Router, MemoryRouter, StaticRouter } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
import { renderRoutes } from 'react-router-config';

import routes from './routes';
import { ruuiStore, appStore } from './store';
import { history } from './store/reducers';

type ContainerProps = {
	ssrLocation?: string,
	ssrContext?: Object,
};

function AppContainer(props: ContainerProps) {
	const routerAndProps = getRouterAndProps(props),
		{ component: Router, props: routerProps  } = routerAndProps;

	return <RuuiProvider store={ruuiStore}>
		<Provider store={appStore}>
			<Router {...routerProps}>
				{renderRoutes(routes)}
			</Router>
		</Provider>

		<Tooltip/>
	</RuuiProvider>;
}

export default AppContainer;

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
			component: ConnectedRouter,
			props: { history, },
		};
	} else {
		return {
			component: MemoryRouter,
			props: {},
		};
	}
}
