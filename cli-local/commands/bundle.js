const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const dotenv = require('dotenv');

function run() {
	console.log(chalk.whiteBright('Bundling project to production output...'));
	dotenv.config({ path: path.resolve(process.cwd(), 'node_modules', 'react-universal-ui', 'cli-local', 'env', 'prod.env') });

	setTimeout(() => {
		const configs = require('../tools/webpack.config'),
			compiler = webpack(configs);

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