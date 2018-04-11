/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const colors = require('colors');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

console.log('Building common chunks... Grab a cup of coffee while this is running ;)'.bgMagenta);

const devVendors = [
	'react-hot-loader',
	'sockjs-client',
	'url', 'strip-ansi', 'ansi-regex',
];

module.exports = {
	devtool: 'eval-source-map',
	entry: {
		'vendor': [
			...devVendors, 'lodash',
			'react', 'react-dom', 'react-native-web',
			'redux', 'react-redux',
			'babel-polyfill', 'tinycolor2',
		],
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
			},
			{
				test: /\.json/,
				loader: 'json-loader'
			}
		],
	},

	output: {
		filename: '[name].cache.js',
		path: path.join(__dirname, 'web'),
		library: '[name]_lib',
	},

	plugins: [
		new webpack.DllPlugin({
			path: path.join(__dirname, 'web/[name]-manifest.json'),
			name: '[name]_lib'
		}),
		new ProgressBarPlugin({
			width: 39, complete: '▓'.green.bgGreen, incomplete: ' '.green.bgWhite,
			format: 'Build (:bar) (:elapsed seconds)',
			summary: false, customSummary: (buildTime) => {
				console.log('Build completed after', ` ${buildTime} `.bgGreen);
			},
		}),
	],
};