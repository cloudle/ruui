/* eslint-disable */

const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const ruuiConfigsPath = path.resolve(process.cwd(), 'ruui.config.js');

const devVendors = [
	'react-hot-loader',
	'sockjs-client',
	'url', 'strip-ansi', 'ansi-regex',
];

let vendors = [
	...devVendors, 'lodash',
	'react', 'react-dom', 'react-native-web',
	'redux', 'react-redux',
	'babel-polyfill', 'tinycolor2',
];

try {
	const ruuiConfigs = require(ruuiConfigsPath),
		extraVendors = ruuiConfigs.extraVendors || [];

	vendors.concat(extraVendors);
	if (ruuiConfigs.vendors) vendors = ruuiConfigs.vendors;
} catch (e) {}

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
				loaders: ['babel-loader'],
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