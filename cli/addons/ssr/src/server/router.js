import { Router } from 'express';
import { AppRegistry } from 'react-native';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { configs as cliConfigs } from 'react-universal-ui/cli';
import App from '../';

const router = Router(),
	isProduction = cliConfigs.ruui.env() === 'production';

AppRegistry.registerComponent(cliConfigs.appJson.name, () => App);

router.use('*', (req, res, next) => {
	const initialProps = { ssrLocation: req.baseUrl, ssrContext: {} },
		{ element, getStyleElement } = AppRegistry.getApplication(cliConfigs.appJson.name, { initialProps, rootTag: 'root' }),
		initialHtml = renderToString(element),
		initialStyles = renderToStaticMarkup(getStyleElement()),
		pageTemplate = cliConfigs.paths.getEjsTemplate();

	res.render(pageTemplate, {
		ssrContext: {
			initialStyles,
			initialHtml,
			serverSide: true,
			appName: cliConfigs.appJson.displayName || cliConfigs.appJson.name,
			publicPath: cliConfigs.ruui.publicPath || '/',
			buildId: cliConfigs.ruuiJson.buildId,
			isProduction,
		},
	});
});

module.exports = router;
