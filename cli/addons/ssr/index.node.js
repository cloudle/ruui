const chalk = require('chalk'),
	moduleAlias = require('module-alias'),
	chokidar = require('chokidar'),
	invalidate = require('invalidate-module'),
	path = require('path'),
	express = require('express'),
	morgan = require('morgan'),
	server = express(),
	{ configs: cliConfigs } = require('react-universal-ui/cli'),
	isProduction = cliConfigs.ruui.env() === 'production',
	port = process.env.PORT || 3005;

moduleAlias.addAlias('react-native', 'react-native-web');

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
	const router = require('./src/server/router');
	router(req, res, next);
});

server.listen(port, () => {
	console.log('Your api-server now listening at', chalk.green(`localhost:${port}`), ':p');
});
