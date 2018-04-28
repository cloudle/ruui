const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const lodash = require('lodash');
const webpack = require('webpack');
const paths = require('./paths');
const mkdirp = require('mkdirp');

module.exports = (callback, force = false, silent = false) => {
	const currentPackageJson = require(paths.packageJson),
		previousConfigExist = fs.existsSync(paths.previousPackageJson);

	if (force) {
		buildCache(callback, silent, 'force');
	} else if (previousConfigExist) {
		const previousConfigJson = require(paths.previousPackageJson),
			isDependencyEqual = lodash.isEqual(currentPackageJson.dependencies, previousConfigJson.dependencies),
			isCacheExist = fs.existsSync(paths.cache);

		if (!isDependencyEqual || !isCacheExist) {
			buildCache(callback, silent, 'changed');
		} else {
			if (!silent) console.log(chalk.gray('No changes detected, keep using old cache..'));
			if (lodash.isFunction(callback)) callback(true);
		}
	} else {
		buildCache(callback, silent, 'initial');
	}
};

function buildCache(callback, slient = false, cacheType = 'nope') {
	console.log(chalk.whiteBright('Building common chunk cache, this may take a while...'));

	if (cacheType === 'initial') {
		console.log(chalk.gray("It's seem that no previous cache was built,\nfirst time cache may take longer time than normal!\n"));
	} else if (cacheType === 'changed') {
		console.log(chalk.gray('Dependencies changed or cache removed, rebuilding cache..\n'));
	} else if (cacheType === 'force') {
		console.log(chalk.gray('Using force option, building cache..\n'));
	}

	setTimeout(() => {
		const configs = require('../tools/webpack.vendor'),
			compiler = webpack(configs);

		compiler.run((error, stats) => {
			if (error) console.log(error);
			else {
				const currentPackageJson = require(paths.packageJson);

				mkdirp.sync(paths.ruui);
				fs.writeFileSync(paths.previousPackageJson, JSON.stringify(currentPackageJson, null, 2));
				if (lodash.isFunction(callback)) callback();
			}
		});
	}, 0);
}
