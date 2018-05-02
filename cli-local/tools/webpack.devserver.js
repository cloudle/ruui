const path = require('path'),
	fs = require('fs'),
	webpack = require('webpack'),
	WebpackDevServer = require('webpack-dev-server'),
	webpackConfigs = require('./webpack.config'),
	configs = require('../util/configs'),
	port = 3000,
	optimizeMode = process.env.OPTIMIZE !== undefined;

const defaultServerConfigs = {
	publicPath: configs.ruui.publicPath || '/',
	port, contentBase: 'web', hot: true,
	historyApiFallback: true,
	headers: {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
		'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
	},
	stats: { /* https://webpack.js.org/configuration/stats/#stats */
		all: true,
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
};

function defaultConfigurator(baseConfig) { return baseConfig; }

const compiler = webpack(webpackConfigs),
	serverConfigurator = configs.ruui.dev || defaultConfigurator,
	serverConfigs = serverConfigurator(defaultServerConfigs);

module.exports = new WebpackDevServer(compiler, serverConfigs);
