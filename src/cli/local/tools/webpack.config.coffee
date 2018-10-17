path = require("path")
chalk = require(path.resolve(process.cwd(), "node_modules", "chalk"))
mkdirp = require(path.resolve(process.cwd(), "node_modules", "mkdirp"))
uuid = require(path.resolve(process.cwd(), "node_modules", "uuid"))
webpack = require(path.resolve(process.cwd(), "node_modules", "webpack"))
HtmlWebpackPlugin = require(path.resolve(process.cwd(), "node_modules", "html-webpack-plugin"))
DefinePlugin = require(path.resolve(process.cwd(), "node_modules", "webpack/lib/DefinePlugin"))
ProgressBarPlugin = require(path.resolve(process.cwd(), "node_modules", "progress-bar-webpack-plugin"))
{ paths, ruui, ruuiJson, appJson } = require("../util/configs")
{ terminalTheme } = require("../util/helper")
publicPath = ruui.publicPath or "/"
analyzeMode = process.env.ANALYZE is "true"
isProduction = ruui.env is "production"
htmlOptions = {
	isProduction
	publicPath
	appName: appJson.displayName or appJson.name or "Ruui Application"
	useVendorChunks: false
}
uniqueId = ruui.buildId or uuid.v4
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
	extendedState = Object.assign(configs.ruuiJson, { buildId })
	mkdirp(paths.ruui)
	fs.writeFileSync(paths.ruuiJson, JSON.stringify(extendedState, null, 2))
else
	optionalPlugins.push(new webpack.HotModuleReplacementPlugin())
	optionalPlugins.push(new webpack.NamedModulesPlugin())

defaultConfigs =
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
		modules: ["node_modules"]
		extensions: [".web.js", ".js"]
	module:
		rules: [
			test: /\.js?$/
			loader: 'babel-loader'
			options:
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
			ENV: JSON.stringify(ruui.env)
			'process.env.NODE_ENV': JSON.stringify(ruui.env)
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

defaultConfigurator = (baseConfig) -> baseConfig
configurator = ruui.webpack or defaultConfigurator

module.exports = configurator(defaultConfigs, webpack)
