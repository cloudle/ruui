fs = require("fs")
path = require("path")
{ ruuiModule, ruuiCliModule, } = require("./helper")

paths =
	ruui: path.resolve(process.cwd(), "ruui")
	ruuiConfig: path.resolve(process.cwd(), "ruui.config.js")
	packageJson: path.resolve(process.cwd(), "package.json")
	appJson: path.resolve(process.cwd(), "app.json")
	ruuiJson: path.resolve(process.cwd(), "ruui", "ruui.json")
	getEnv: (name) -> ruuiModule("cli", "env", "#{name}.env")
	getEjsTemplate: () ->
		manualEjsPath = path.resolve(process.cwd(), "index.ejs")
		localEjsPath = path.resolve(process.cwd(), "cli", "index.ejs")
		defaultEjsPath = ruuiModule("cli", "index.ejs")

		if fs.existsSync(manualEjsPath) then manualEjsPath
		else if fs.existsSync(localEjsPath) then localEjsPath
		else defaultEjsPath

appJson = {}; ruuiJson = {}; ruuiConfig = {}
appJson = require(paths.appJson) if fs.existsSync(paths.appJson)
ruuiJson = require(paths.ruuiJson) if fs.existsSync(paths.ruuiJson)
ruuiConfig =
	publicPath: (env) -> "/"
	host: () -> process.env.HOST or "localhost"
	port: () -> process.env.PORT or 3000
	env: () -> process.env.ENV or "development"
	optimizeMode: () -> process.env.OPTIMIZE is "true"

ruuiConfig = Object.assign(ruuiConfig, require(paths.ruuiConfig)) if fs.existsSync(paths.ruuiConfig)

module.exports = {
	paths
	appJson
	ruuiJson
	ruui: ruuiConfig
}
