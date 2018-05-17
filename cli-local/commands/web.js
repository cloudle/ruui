const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const webpack = require('webpack');
const chalk = require('chalk');
const dotenv = require('dotenv');
const buildCache = require('../util/cache');
const paths = require('../util/paths');

function run(argv, config, args) {
	if (args.analyze) dotenv.config({ path: paths.getEnv('analyze') });
	buildCache((cached) => runServer(args.port, cached), false, true);
}

function runServer(port, cached) {
	console.log(`${cached ? '' : '\n'}Preparing super awesome dev-server at`, chalk.black(`localhost:${port}`), ':p');

	setTimeout(() => {
		const devServer = require('../tools/webpack.devserver');

		devServer.listen(3000, 'localhost', (err, result) => {
			if (err) console.log(err);
			return true;
		});
	}, 0);
}

module.exports = {
	name: 'dev',
	description: 'run Development server',
	func: run,
	examples: [{
		desc: 'Run on different port, e.g. localhost:3005',
		cmd: 'ruui web --port 3005',
	}, {
		desc: 'Run bundle analyzer tool (on browser) to optimize cache',
		cmd: 'ruui web --analyze',
	}],
	options: [{
		command: '--port [number]',
		default: process.env.RUUI_PORT || 3000,
		description: 'Specify port for development server',
		parse: val => Number(val),
	}, {
		command: '--analyze',
		description: 'Run with bundle-analyzer, help optimize caching..',
	}],
};
