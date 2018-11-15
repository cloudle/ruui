fs = require("fs")
path = require("path")
chalk = require("chalk")
webpack = require("webpack")
{ paths, ruui, ruuiJson, appJson } = require("../util/configs")
{ setEnv } = require("../util/helper")

run = ->
	setEnv({ ENV: "production" })
	console.log("Bundling project to #{chalk.magenta(process.env.ENV)} release...")

	configs = require("../tools/webpack.config")()
	compiler = webpack(configs)
	{ previousBuildId } = ruuiJson

	compiler.run (error, stats) ->
		if error
			console.log(error)
		else
			lastBuildPath = path.resolve(paths.ruui, "#{previousBuildId}.js")
			indexHtmlPath = path.resolve(paths.ruui, "index.html")
			nodeServerPath = path.resolve(process.cwd(), "index.node.js")
			keepBuild = ruui.keepPreviousBuild
			keepHtml = ruui.keepHtml

			if not keepBuild and previousBuildId and fs.existsSync(lastBuildPath)
				console.log(chalk.gray("clean up previous build, #{chalk.green("deleted")} ruui/#{previousBuildId}.js"))
				fs.unlinkSync(lastBuildPath)
			if not keepHtml and fs.existsSync(nodeServerPath) and fs.existsSync(indexHtmlPath)
				fs.unlinkSync(indexHtmlPath)

module.exports =
	name: "bundle"
	description: "bundle ruui project to production output"
	func: run
