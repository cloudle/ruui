fs = require("fs")
path = require("path")
childProcess = require("child_process")
{ paths, ruui, appJson } = require("../util/configs")
{ localModule, setEnv, getJson, writeFile } = require("../util/helper")
{ requireModule, } = require("../util/modules")

chalk = requireModule("chalk")
webpack = requireModule("webpack")

run = (argv, config, args) ->
	setEnv({ ENV: "production", NODE_ENV: "production" })
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
	if args.hydrate
		try
			# start hydrate process..
			console.log("Generate static markups..")
			setEnv({ ENV: "production", HYDRATE: "true", NODE_ENV: "production" })
			nodeEntryPath = localModule("index.node.js")
			babelNodePath = localModule("node_modules", "@babel", "node", "bin", "babel-node.js")

			unless fs.existsSync(babelNodePath)
				console.log("couldn't locate babel-node module, make sure @babel/node package installed!")
				return

			child = childProcess.fork babelNodePath, [nodeEntryPath],
				cwd: process.cwd()
				stdio: "inherit"
			child.on "close", () -> resolve()
		catch error then console.log "error during spawn hydrate process\n", error
	else resolve()

module.exports =
	name: "bundle"
	description: "bundle ruui project to production output"
	func: run
	options: [
		command: "--hydrate"
		default: ruui.ssrHydrate
		description: "Hydrate pages to static HTML markup like Gatsby.js"
	]
