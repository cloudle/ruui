chalk = require("chalk")
dotenv = require("dotenv")
buildCache = require("../util/cache")
{ paths, ruui, ruuiJson, appJson } = require("../util/configs")

run = (argv, config, args) ->
	runningHost = if ruui.host then ruui.host else "localhost"
	console.log("Preparing development server at #{runningHost}:#{chalk.gray(ruui.port)}")

	dotenv.config({ path: paths.getEnv("analyze") }) if args.analyze
	devServer = require("../tools/webpack.devserver")
	devServer.listen ruui.port, ruui.host or "0.0.0.0", (error, result) ->
		console.log(error) if error
		true

module.exports =
	name: "dev"
	description: "run Development server"
	func: run
	examples: [
		desc: "Run on different port, e.g. localhost:3005"
		cmd: "ruui dev --port 3005"
	,
		desc: "Run bundle analyzer tool (on browser) to optimize cache"
		cmd: "ruui web --analyze"
	]
	options: [
		command: "--port [number]"
		default: process.env.RUUI_PORT or 3000
		description: "Specify port for development server"
		parse: (val) -> Number(val)
	,
		command: "--analyze"
		description: "Run with bundle-analyzer, help optimize caching.."
	]
