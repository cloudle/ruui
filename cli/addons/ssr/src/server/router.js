import { Router } from 'express';
import { AppRegistry } from 'react-native';
import reactDom from 'react-dom/server';
import { configs as cliConfigs, ssrUtils } from 'react-universal-ui/cli';
import App from '../';
import routes from '../routes';

const router = Router();
AppRegistry.registerComponent(cliConfigs.appJson.name, () => App);
/* Pre-render application on Node.js and send to Browser */
router.use('*', ssrUtils.universalRender(AppRegistry, reactDom));

module.exports = {
	router,
	hydrate: () => ssrUtils.hydrate(AppRegistry, reactDom, routes),
};
