/* eslint-disable */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk');
const lodash = require('lodash');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const paths = require('../util/paths');
const configs = require('../util/configs');
const helpers = require('../util/helpers');

const devVendors = [
	'react-hot-loader', 'sockjs-client',
	'url', 'strip-ansi', 'ansi-regex',
	'webpack', 'webpack-dev-server', 'html-webpack-plugin',
];

let packageJson = require(paths.packageJson),
	vendors = [...devVendors];

const dependencies = packageJson.dependencies || {},
	extraCaches = configs.ruui.extraCaches || [],
	excludeCaches = configs.ruui.excludeCaches  || [],
	terminalTheme = helpers.terminalTheme;

vendors = vendors.concat(Object.keys(dependencies));
vendors = vendors.concat(extraCaches);
vendors = vendors.filter(item => excludeCaches.indexOf(item) < 0);
vendors = lodash.uniq(vendors);

module.exports = {
	mode: 'development',
	entry: {
		vendor: vendors,
	},
	resolve: {
		alias: {
			'react-native': 'react-native-web',
		},
		modules: ['node_modules'],
		extensions: ['.js']
	},
	module: {
		rules: [
			{
				test: /\.js?$/,
				loader: 'babel-loader',
				options: {
					cacheDirectory: true,
				}
			},
			{ test: /\.css$/, loader: "style-loader!css-loader" },
			{
				test: /\.(png|jpg|svg|ttf)$/,
				loader: 'file-loader?name=[name].[ext]'
			}
		],
	},
	output: {
		filename: '[name].cache.js',
		path: path.resolve(process.cwd(), 'web'),
		library: '[name]_lib',
	},
	plugins: [
		new webpack.DllPlugin({
			path: path.resolve(process.cwd(), 'web', '[name]-manifest.json'),
			name: '[name]_lib'
		}),
		new ProgressBarPlugin({
			width: 32,
			complete: terminalTheme.progressbar.complete,
			incomplete: terminalTheme.progressbar.remaining,
			format: `building ${terminalTheme.progressbar.prefix}:bar${terminalTheme.progressbar.suffix} (:elapsed seconds)`,
			summary: false, customSummary: (buildTime) => {
				console.log(`${terminalTheme.prefix}${chalk.gray(`ruui`)}${terminalTheme.suffix} cache was built successfully after`, `[${buildTime}]`);
			},
		}),
	],
};
