const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const lodash = require('lodash');
const webpack = require('webpack');
const paths = require('./paths');
const mkdirp = require('mkdirp');
const configs = require('./configs');

module.exports = (callback, force = false, isAutoRun = false) => {
	const currentPackageJson = require(paths.packageJson),
		ruuiJsonExist = fs.existsSync(paths.ruuiJson),
		cacheExist = fs.existsSync(paths.cache),
		isAutoCache = !configs.ruui.autoCache;

	if (force) {
		buildCache(callback, isAutoRun, 'force');
	} else if (ruuiJsonExist && cacheExist) {
		const ruuiJson = require(paths.ruuiJson),
			isDependencyChange = !lodash.isEqual(currentPackageJson.dependencies, ruuiJson.dependencies);

		if (isDependencyChange) {
			if (isAutoCache && isAutoRun) { /* is autoCache mode and auto-run with [dev] command */
				console.log(
					chalk.gray('Dependency change detected, run'),
					chalk.black('ruui cache'),
					chalk.gray('to keep cached dependencies in sync!'));
				console.log(
					chalk.gray('(turn on'),
					chalk.black('autoCache mode'),
					chalk.gray('in'),
					chalk.black('ruui.configs.js'),
					chalk.gray('to automatically rebuild cache when dependency change detected)'));

				if (lodash.isFunction(callback)) callback(true);
			} else {
				buildCache(callback, isAutoRun, 'changed');
			}
		} else {
			if (!isAutoRun) {
				console.log(
					chalk.gray('No changes detected, keep using old cache.\nUse'),
					chalk.black('ruui cache --force'),
					chalk.gray('to force rebuild without checking dependency changes!'));
			}

			if (lodash.isFunction(callback)) callback(true);
		}
	} else {
		buildCache(callback, isAutoRun, 'initial');
	}
};

function buildCache(callback, isAutoRun = false, cacheType = 'nope') {
	console.log(chalk.whiteBright('Building common chunks (cache), this may take a while...'));

	if (cacheType === 'initial') {
		console.log(
			chalk.gray('No previous cache was found, first time cache will take longer time than normal!\n'),
			chalk.gray('Grab a cup of coffee and enjoy while waiting for this ;)\n'));
	} else if (cacheType === 'changed') {
		console.log(chalk.gray('Dependency change detected, rebuilding cache..\n'));
	} else if (cacheType === 'force') {
		console.log(chalk.gray('Using force option, building cache..\n'));
	}

	setTimeout(() => {
		const vendorConfigs = require('../tools/webpack.vendor'),
			compiler = webpack(vendorConfigs);

		compiler.run((error, stats) => {
			if (error) console.log(error);
			else {
				const currentPackageJson = require(paths.packageJson);

				mkdirp.sync(paths.ruui);
				fs.writeFileSync(paths.ruuiJson, JSON.stringify({
					...configs.ruuiJson,
					dependencies: currentPackageJson.dependencies || {},
					devDependencies: currentPackageJson.devDependencies || {},
				}, null, 2));

				if (lodash.isFunction(callback)) callback();
			}
		});
	}, 0);
}
