/* eslint-disable */

const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk');
const lodash = require('lodash');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const packageJson = require(path.resolve(process.cwd(), 'package.json'));
const dependencies = packageJson.dependencies || {};

const devVendors = [
	'react-hot-loader',
	'sockjs-client',
	'url', 'strip-ansi', 'ansi-regex',
	'webpack', 'webpack-dev-server', 'html-webpack-plugin',
];

let vendors = [
	...devVendors, 'lodash',
	'react', 'react-dom', 'react-native-web',
	'redux', 'react-redux',
	'babel-polyfill', 'tinycolor2',
];

vendors.concat(dependencies);
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
			width: 32, complete: chalk.whiteBright('░'), incomplete: chalk.gray('░'),
			format: 'building ⸨:bar⸩ (:elapsed seconds)',
			summary: false, customSummary: (buildTime) => {
				console.log('｢ruui｣ cache built successfully after', chalk.whiteBright(`[${buildTime}]`));
			},
		}),
	],
};