chalk = require("chalk")
{ paths, ruui, ruuiJson, appJson } = require("../util/configs")
{ setEnv } = require("../util/helper")

run = (argv, config, args) ->
	setEnv({ PORT: args.port })
	setEnv({ ANALYZE: "true" }) if args.analyze

	host = ruui.host(); port = ruui.port()
	runningHost = if host is "0.0.0.0" then "localhost" else host
	console.log("Preparing development server at #{runningHost}:#{chalk.gray(port)}")

	devServer = require("../tools/webpack.devserver")()
	devServer.listen port, host or "0.0.0.0", (error, result) ->
		console.log(error) if error
		true

module.exports =
	name: "dev"
	description: "run Development server"
	func: run
	examples: [
		desc: "Run on different port, e.g. localhost:3005"
		cmd: "ruui dev --port 3005"
	]
	options: [
		command: "--port [number]"
		default: process.env.RUUI_PORT or 3000
		description: "Specify port for development server"
		parse: (val) -> Number(val)
	]
