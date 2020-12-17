import React from 'react';
import { Router } from 'express';
import { AppRegistry } from 'react-native';
import reactDom from 'react-dom/server';
import { ServerContainer, } from '@react-navigation/native';
import { configs as cliConfigs, ssrUtils } from 'react-universal-ui/cli';
import App from '../index';
import routes from '../routes';

const router = Router();
AppRegistry.registerComponent(cliConfigs.appJson.name, () => App);

/* Pre-render application on Node.js and send to Browser */
router.use('*', (req, res, next) => {
	const { ruui, paths, appJson, ruuiJson, } = cliConfigs;
	const env = ruui.env();
	const isProduction = env === 'production';
	const publicPath = ruui.publicPath(env);
	const location = new URL(req.baseUrl, 'http://localhost:3005');
	const initialProps = { ssrLocation: req.baseUrl, ssrContext: {} };
	const ref = React.createRef();
	const { element, getStyleElement, } = AppRegistry.getApplication(appJson.name, { initialProps, rootTag: 'root' });
	const wrappedElement = <ServerContainer ref={ref} location={location}>{element}</ServerContainer>;
	const initialHtml = reactDom.renderToString(wrappedElement);
	const initialStyles = reactDom.renderToStaticMarkup(getStyleElement());
	const pageTemplate = paths.getEjsTemplate();
	const options = ref.current?.getCurrentOptions();

	res.render(pageTemplate, {
		ssrContext: {
			initialHtml,
			initialStyles,
			serverSide: true,
			appName: options.title || appJson.displayName || appJson.name,
			publicPath,
			buildId: ruuiJson.buildId,
			isProduction, ...ruui.ejsTemplate,
		},
	});
});

module.exports = {
	router,
	hydrate: () => ssrUtils.hydrate(AppRegistry, reactDom, routes),
};
