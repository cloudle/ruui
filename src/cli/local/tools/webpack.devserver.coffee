path = require("path")
webpack = require(path.resolve(process.cwd(), "node_modules", "webpack"))
WebpackDevServer = require(path.resolve(process.cwd(), "node_modules", "webpack-dev-server"))
webpackConfigs = require("./webpack.config")
{ ruui } = require("../util/configs")


defaultConfigs =
	publicPath: ruui.publicPath or "/"
	port: ruui.port
	contentBase: "ruui"
	hot: true
	historyApiFallback: true
	headers:
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
		'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
	stats:
		all: true
		assets: ruui.optimizeMode
		colors: true
		version: true
		hash: ruui.optimizeMode
		timings: true
		chunks: ruui.optimizeMode
		performance: ruui.optimizeMode
		modules: ruui.optimizeMode
		moduleTrace: ruui.optimizeMode
		modulesSort: "size"
		chunkModules: ruui.optimizeMode
		chunkOrigins: ruui.optimizeMode
		cached: true
		error: true
		cachedAssets: ruui.optimizeMode
	quiet: !ruui.optimizeMode
	noInfo: !ruui.optimizeMode
	overlay: true

defaultConfigurator = (baseConfig) -> baseConfig

compiler = webpack(webpackConfigs)
configurator = ruui.dev or defaultConfigurator
serverConfigs = configurator(defaultConfigs)

module.exports = new WebpackDevServer(compiler, serverConfigs)
