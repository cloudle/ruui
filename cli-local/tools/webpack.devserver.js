const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');

const port = 3000;
const optimizeMode = process.env.OPTIMIZE !== undefined;

const compiler = webpack(config);

const devServer = new WebpackDevServer(compiler, {
	publicPath: config.output.publicPath,
	port, contentBase: 'web', hot: true,
	historyApiFallback: true,
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
		'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
	},
	stats: { /* https://webpack.js.org/configuration/stats/#stats */
		assets:					optimizeMode,
		colors:					true,
		version:				true,
		hash:						optimizeMode,
		timings:				true,
		chunks:					optimizeMode,
		performance:		optimizeMode,
		modules:				optimizeMode,
		moduleTrace:		optimizeMode,
		modulesSort:		'size',
		chunkModules:		optimizeMode,
		chunkOrigins:		optimizeMode,
		cached:					true,
		error:					true,
		cachedAssets:		optimizeMode,
	},
	quiet: !optimizeMode,
	noInfo: !optimizeMode,
	overlay: true,
});

module.exports = devServer;