fs = require("fs")
path = require("path")
chalk = require(path.resolve(process.cwd(), "node_modules", "chalk"))
webpack = require(path.resolve(process.cwd(), "node_modules", "webpack"))
HtmlWebpackPlugin = require(path.resolve(process.cwd(), "node_modules", "html-webpack-plugin"))
DefinePlugin = require(path.resolve(process.cwd(), "node_modules", "webpack/lib/DefinePlugin"))
ProgressBarPlugin = require(path.resolve(process.cwd(), "node_modules", "progress-bar-webpack-plugin"))
{ paths, ruui, appJson } = require("../util/configs")
{ localModule, terminalTheme, getJson, writeFile, uuid } = require("../util/helper")

defaultConfigurator = (baseConfig) -> baseConfig
defaultConfigs = ->
	env = ruui.env()
	publicPath = ruui.publicPath or "/"
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
		"react-hot-loader/patch"
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
		optionalPlugins.push(new webpack.NamedModulesPlugin())

	return {
		context: process.cwd()
		mode: if isProduction then "production" else "development"
		cache: true
		entry:
			app: if isProduction then entries else hot.concat(entries)
		optimization:
			minimize: isProduction
		output:
			publicPath: publicPath
			path: paths.ruui
			filename: if isProduction then "#{buildId}.js" else "[name].js"
			chunkFilename: '[name].js'
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
					plugins: if isProduction then [] else ['react-hot-loader/babel']
			,
				test: /\.css$/
				loader: 'style-loader!css-loader'
			,
				test: /\.(png|jpg|svg|ttf)$/
				loader: 'file-loader?name=[name].[ext]'
			]
		plugins: [
			new DefinePlugin {
				ENV: JSON.stringify(env)
				'process.env.NODE_ENV': JSON.stringify(env)
			}
		,
			new HtmlWebpackPlugin Object.assign(htmlOptions, {
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
