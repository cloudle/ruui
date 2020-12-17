const chalk = require('chalk');
const moduleAlias = require('module-alias');
const chokidar = require('chokidar');
const invalidate = require('invalidate-module');
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const { configs: cliConfigs } = require('react-universal-ui/cli');
const alias = require('./configurations/moduleAliases');

const isProduction = cliConfigs.ruui.env() === 'production';
const port = process.env.PORT || 3005;
const hydrateMode = process.env.HYDRATE;
const server = express();

moduleAlias.addAliases(Object.assign({}, alias.shared, alias.node));

if (!isProduction) { /* <- hot reload server-side code on development mode */
	const watcher = chokidar.watch('./src', { ignoreInitial: true });

	watcher.on('all', (event, filename) => {
		console.log(chalk.magenta('hot code reload'), chalk.green(filename), 'updated.');
		invalidate(path.resolve(filename));
	});
}
server.set('view engine', 'ejs');
server.use(express.static('ruui'));
server.use(morgan('dev'));

server.use((req, res, next) => {
	require('./src/server').router(req, res, next);
});

if (hydrateMode) { /* <- on hydrate-mode, instead of serving node.js */
	require('./src/server').hydrate();
} else {
	server.listen(port, () => { /* <- serve express as normal */
		/* server-side-rendering ready */
	});
}
