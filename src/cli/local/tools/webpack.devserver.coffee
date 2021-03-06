path = require("path")
webpackConfigs = require("./webpack.config")
{ ruui } = require("../util/configs")
{ requireModule, } = require("../util/modules")

webpack = requireModule("webpack")
WebpackDevServer = requireModule("webpack-dev-server")

defaultConfigurator = (baseConfig) -> baseConfig
defaultConfigs = ->
	env = ruui.env()
	publicPath = ruui.publicPath(env)
	optimizeMode = ruui.optimizeMode()
	port = ruui.port()

	return {
		publicPath: publicPath
		port: port
		contentBase: "ruui"
		hot: true
		historyApiFallback: true
		headers:
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
			'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
		stats:
			all: true
			assets: optimizeMode
			colors: true
			version: true
			hash: optimizeMode
			timings: true
			chunks: optimizeMode
			performance: optimizeMode
			modules: optimizeMode
			moduleTrace: optimizeMode
			modulesSort: "size"
			chunkModules: optimizeMode
			chunkOrigins: optimizeMode
			cached: true
			error: true
			cachedAssets: optimizeMode
		quiet: !optimizeMode
		noInfo: !optimizeMode
		overlay: true
	}

module.exports = ->
	compiler = webpack(webpackConfigs())
	configurator = ruui.dev or defaultConfigurator
	devServerConfigs = configurator(defaultConfigs())

	return new WebpackDevServer(compiler, devServerConfigs)
