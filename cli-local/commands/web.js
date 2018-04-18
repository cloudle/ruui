const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const webpack = require('webpack');
const chalk = require('chalk');

const port = process.env.ENV || 3000;

function run() {
	const cachePath = path.resolve(process.cwd(), 'web', 'vendor-manifest.json');

	if (fs.existsSync(cachePath)) {
		runServer();
	} else {
		console.log(chalk.whiteBright('Building common chunk cache, this may take a while...'));
		console.log(chalk.gray("(caching build will only run once on project's first time run)\n"));

		setTimeout(() => {
			const configs = require('../tools/webpack.vendor'),
				compiler = webpack(configs);

			compiler.run((error, stats) => {
				if (error) console.log(error);
				runServer('\n');
			});
		}, 0);
	}
}

function runServer(prefix = '') {
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
};