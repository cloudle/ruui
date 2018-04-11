const path = require('path');
const chalk = require('chalk');
const childProcess = require('child_process');
const webpack = require('webpack');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');

function run() {
	console.log(chalk.whiteBright('Building common chunks, this may take a while...'));
	console.log(chalk.gray("It's time to take a cup of coffee while this is running ;)\n"));

	setTimeout(() => {
		const configs = require('../tools/webpack.vendor'),
			compiler = webpack(configs);

		compiler.run((error, stats) => {
			if (error) console.log(error);
		});
	}, 0);
}

module.exports = {
	name: 'vendor',
	description: 'cache common chunks.. boost up build speed!',
	func: run,
};