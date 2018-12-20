fs = require("fs")
path = require("path")
childProcess = require("child_process")
chalk = require("chalk")
webpack = require("webpack")
{ paths, ruui, appJson } = require("../util/configs")
{ localModule, setEnv, getJson, writeFile } = require("../util/helper")

run = (argv, config, args) ->
	setEnv({ ENV: "production" })
	console.log("Bundling project to #{chalk.magenta(process.env.ENV)} release...")

	configs = require("../tools/webpack.config")()
	compiler = webpack(configs)

	compiler.run (error, stats) ->
		if error then console.log(error)
		else
			ruuiJson = getJson(paths.ruuiJson) # lastest version of ruui.json, after build successfully!
			lastBuildPath = path.resolve(paths.ruui, "#{ruuiJson.previousBuildId}.js")
			indexHtmlPath = path.resolve(paths.ruui, "index.html")
			nodeEntryPath = localModule("index.node.js")
			keepBuild = ruui.keepPreviousBuild
			keepHtml = ruui.keepHtml

			if not keepBuild and ruuiJson.previousBuildId and fs.existsSync(lastBuildPath)
				console.log(chalk.gray("clean up previous build, #{chalk.green("deleted")} ruui/#{ruuiJson.previousBuildId}.js"))
				fs.unlinkSync(lastBuildPath)
			if not keepHtml and fs.existsSync(nodeEntryPath) and fs.existsSync(indexHtmlPath)
				fs.unlinkSync(indexHtmlPath)

			extendedRuuiJson = Object.assign(ruuiJson, { previousBuildId: ruuiJson.buildId })
			writeFile paths.ruuiJson, JSON.stringify(extendedRuuiJson, null, 2), () ->
				await hydrate(args)
				console.log("Finished generate static markups!")

hydrate = (args) -> new Promise (resolve, reject) ->
	resolve() unless args.hydrate
	# start hydrate process..
	console.log("Generate static markups..")
	setEnv({ ENV: "production", HYDRATE: "true" })
	nodeEntryPath = localModule("index.node.js")
	child = childProcess.spawn "babel-node", [nodeEntryPath],
		cwd: process.cwd()
		stdio: "inherit"
	child.on "close", () -> resolve()

module.exports =
	name: "bundle"
	description: "bundle ruui project to production output"
	func: run
	options: [
		command: "--hydrate"
		default: ruui.ssrHydrate
		description: "Hydrate pages to static HTML markup like Gatsby.js"
	]
