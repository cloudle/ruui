fs = require("fs")
path = require("path")
chalk = require("chalk")
webpack = require("webpack")
{ paths, ruui, ruuiJson, appJson } = require("../util/configs")
{ setEnv } = require("../util/helper")

run = ->
	setEnv({ ENV: "production" })
	console.log("Bundling project to #{process.env.ENV} release...")

	configs = require("../tools/webpack.config")()
	compiler = webpack(configs)
	previousBuildId = ruuiJson.buildId

	compiler.run (error, stats) ->
		if error
			console.log(error)
		else
			lastBuildPath = path.resolve(paths.ruui, "#{previousBuildId}.js")
			keepBuild = ruui.keepPreviousBuild

			if !keepBuild and previousBuildId and fs.existsSync(lastBuildPath)
				console.log(chalk.gray("clean up previous build, deleted ruui/#{previousBuildId}.js"))
				fs.unlinkSync(lastBuildPath)

module.exports =
	name: "bundle"
	description: "bundle ruui project to production output"
	func: run
