/* eslint-disable */

const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk');
const lodash = require('lodash');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const paths = require('../util/paths');

const devVendors = [
	'react-hot-loader', 'sockjs-client',
	'url', 'strip-ansi', 'ansi-regex',
	'webpack', 'webpack-dev-server', 'html-webpack-plugin',
];

let packageJson = {},
	ruuiConfigs = {},
	vendors = [...devVendors, 'redux-logger', 'babel-polyfill', 'lodash', 'tinycolor2',];

if (fs.existsSync(paths.packageJson)) packageJson = require(paths.packageJson);
if (fs.existsSync(paths.ruuiConfig)) ruuiConfigs = require(paths.ruuiConfig);

const dependencies = packageJson.dependencies || {},
	extraCaches = ruuiConfigs.extraCaches || [],
	excludeCaches = ruuiConfigs.excludeCaches  || [];

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
			width: 32, complete: chalk.black('░'), incomplete: chalk.gray('░'),
			format: 'building ⸨:bar⸩ (:elapsed seconds)',
			summary: false, customSummary: (buildTime) => {
				console.log('｢ruui｣ cache built successfully after', chalk.black(`[${buildTime}]`));
			},
		}),
	],
};
