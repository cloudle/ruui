fs = require("fs")
path = require("path")
{ chalk, webpack, } = require("../util/modules")
HtmlWebpackPlugin = require(path.resolve(process.cwd(), "node_modules", "html-webpack-plugin"))
DefinePlugin = require(path.resolve(process.cwd(), "node_modules", "webpack/lib/DefinePlugin"))
ProgressBarPlugin = require(path.resolve(process.cwd(), "node_modules", "progress-bar-webpack-plugin"))
ReactRefreshWebpackPlugin = require(path.resolve(process.cwd(), "node_modules", "@pmmmwh/react-refresh-webpack-plugin"))
{ paths, ruui, appJson } = require("../util/configs")
{ localModule, terminalTheme, getJson, writeFile, uuid } = require("../util/helper")

defaultConfigurator = (baseConfig) -> baseConfig
defaultConfigs = ->
	env = ruui.env()
	publicPath = ruui.publicPath(env)
	isProduction = env is "production"
	htmlOptions = {
		isProduction
		publicPath
		appName: appJson.displayName or appJson.name or "Ruui Application"
		useVendorChunks: false
	}
	uniqueId = ruui.buildId or uuid
	buildId = uniqueId()
	optionalPlugins = []
	polyfills = []#["babel-polyfill"]
	entries = ["./index.web.js"]
	hot = [
		"webpack-dev-server/client?#{publicPath}"
		"webpack/hot/only-dev-server"
	]
	brightFlag = false
	initialBuild = true

	if isProduction
		ruuiJson = getJson(paths.ruuiJson)
		extendedState = Object.assign(ruuiJson, { buildId })
		writeFile(paths.ruuiJson, JSON.stringify(extendedState, null, 2))
	else
		optionalPlugins.push(new webpack.HotModuleReplacementPlugin())
		optionalPlugins.push(new ReactRefreshWebpackPlugin())

	return {
		context: process.cwd()
		mode: if isProduction then "production" else "development"
		cache: true
		entry:
			app:
				import: if isProduction then entries else hot.concat(entries)
				filename: if isProduction then "#{buildId}.js" else "[name].js"
		optimization:
			minimize: isProduction
			moduleIds: "named"
		output:
			publicPath: publicPath
			path: paths.ruui
			filename: "[name].js"
			sourceMapFilename: if isProduction then "#{buildId}.map" else "[name].map"
			chunkFilename: '[id].js'
		resolve:
			mainFields: ["browser", "main", "module"]
			alias:
				"react-native": "react-native-web"
			modules: [localModule("src"), "node_modules"]
			extensions: [".web.js", ".js"]
		module:
			rules: [
				test: /\.js?$/
				loader: 'babel-loader'
				options:
					compact: false
					cacheDirectory: true,
					plugins: if isProduction then [] else [require.resolve('react-refresh/babel')]
			,
				test: /\.sass$/
				use: [
					loader: "style-loader"
				,
					loader: "css-loader"
					options:
						modules: true
				,
					loader: "sass-loader"
				]
			,
				test: /\.(png|jpg|svg|ttf)$/
				loader: "file-loader"
				options:
					name: "[hash].[ext]"
			]
		plugins: [
			new DefinePlugin {
				ENV: JSON.stringify(env)
				'process.env.NODE_ENV': JSON.stringify(env)
			}
		,
			new HtmlWebpackPlugin Object.assign(htmlOptions, ruui.ejsTemplate or {}, {
				template: paths.getEjsTemplate()
				filename: "index.html"
			})
		,
			new ProgressBarPlugin {
				width: 32
				complete: terminalTheme.progressbar.complete,
				incomplete: terminalTheme.progressbar.remaining,
				format: "building #{terminalTheme.progressbar.prefix}:bar#{terminalTheme.progressbar.suffix} (:elapsed seconds)",
				summary: false
				customSummary: (buildTime) ->
					alternatedColor = if brightFlag then ((x) -> x) else chalk.gray
					ruuiBullet = "#{terminalTheme.prefix}#{alternatedColor('ruui')}#{terminalTheme.suffix}"
					buildType = if initialBuild then 'initial build' else 'hot rebuild'
					buildFlag = if isProduction then "production bundle" else buildType
					trailingSpace = if initialBuild then "" else "  "

					console.log(ruuiBullet, chalk.gray("#{buildFlag} completed after#{trailingSpace}"), buildTime)
					brightFlag = !brightFlag
					initialBuild = false
			}
		].concat(optionalPlugins)
	}

module.exports = ->
	configurator = ruui.webpack or defaultConfigurator
	configurator(defaultConfigs(), webpack)
