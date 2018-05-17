const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const dotenv = require('dotenv');

function run() {
	console.log(chalk.whiteBright('Bundling project to production release...'));
	dotenv.config({ path: path.resolve(process.cwd(), 'node_modules', 'react-universal-ui', 'cli-local', 'env', 'prod.env') });

	setTimeout(() => {
		const baseConfigs = require('../tools/webpack.config'),
			compiler = webpack(baseConfigs);

		compiler.run((error, stats) => {
			if (error) console.log(error);
		});
	}, 0);
}

module.exports = {
	name: 'bundle',
	description: 'bundle ruui project to production output',
	func: run,
};
