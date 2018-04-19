const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const webpack = require('webpack');
const chalk = require('chalk');
const dotenv = require('dotenv');

function run(argv, config, args) {
	const cachePath = path.resolve(process.cwd(), 'web', 'vendor-manifest.json');

	if (args.analyze) {
		dotenv.config({ path: path.resolve(process.cwd(), 'node_modules', 'react-universal-ui', 'cli-local', 'env', 'analyze.env') });
	}

	setTimeout(() => {
		if (fs.existsSync(cachePath)) {
			runServer(args.port);
		} else {
			console.log(chalk.whiteBright('Building common chunk cache, this may take a while...'));
			console.log(chalk.gray("(caching build will only run once on project's first time run)\n"));

			setTimeout(() => {
				const configs = require('../tools/webpack.vendor'),
					compiler = webpack(configs);

				compiler.run((error, stats) => {
					if (error) console.log(error);
					runServer(args.port, '\n');
				});
			}, 0);
		}
	}, 50);
}

function runServer(port, prefix = '') {
	console.log(`${prefix}Preparing super awesome dev-server at`, chalk.whiteBright(`localhost:${port}`), ':p');

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
	description: 'run your app in Browser',
	func: run,
	examples: [{
		desc: 'Run on different port, e.g. localhost:3005',
		cmd: 'ruui dev --port 3005',
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