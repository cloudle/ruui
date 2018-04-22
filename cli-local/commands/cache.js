const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const buildCache = require('../util/cache');

function run(argv, config, args) {
	buildCache(null, args.force);
}

module.exports = {
	name: 'cache',
	description: 'cache common chunks.. boost up build speed!',
	func: run,
	options: [{
		command: '--force',
		description: 'Force rebuild cache without further checking..',
	}],
};
