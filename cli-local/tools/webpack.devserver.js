const path = require('path'),
	fs = require('fs'),
	webpack = require('webpack'),
	WebpackDevServer = require('webpack-dev-server'),
	webpackConfigs = require('./webpack.config'),
	port = 3000,
	optimizeMode = process.env.OPTIMIZE !== undefined,
	ruuiConfigsPath = path.resolve(process.cwd(), 'ruui.config.js');

const defaultServerConfigs = {
	publicPath: webpackConfigs.output.publicPath,
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

let serverConfigs = defaultServerConfigs;
const compiler = webpack(webpackConfigs);

function defaultConfigurator(configs) { return configs; }

if (fs.existsSync(ruuiConfigsPath)) {
	const ruuiConfigs = require(ruuiConfigsPath),
		configureDev = ruuiConfigs.dev || defaultConfigurator;

	serverConfigs = configureDev(defaultServerConfigs, webpack);
}

module.exports = new WebpackDevServer(compiler, serverConfigs);