fs = require("fs")
childProcess = require("child_process")
chalk = require("chalk")
{ paths, ruui, ruuiJson, appJson } = require("../util/configs")
{ setEnv, localModule, isPortTaken } = require("../util/helper")

run = (argv, config, args) ->
	{ port, host, devOnly } = args
	nodeEntryPath = localModule("index.node.js")

	launchSsr(nodeEntryPath) if !devOnly and fs.existsSync(nodeEntryPath)
	setTimeout ->
		launchDevServer(host, port)
	, 1000 # <- it take at least


launchSsr = (nodeEntryPath) ->
	child = childProcess.spawn "babel-node", [nodeEntryPath],
		cwd: process.cwd()
		stdio: "inherit"

	child.on "close", () -> process.exit(code)

launchDevServer = (host, port) ->
	setEnv({ PORT: port })
	runningHost = if host is "0.0.0.0" then "localhost" else host
	console.log("Preparing development server at http://#{runningHost}:#{chalk.gray(port)}")

	devServer = require("../tools/webpack.devserver")()
	devServer.listen port, host or "0.0.0.0", (error, result) ->
		console.log(error) if error
		return true

module.exports =
	name: "dev"
	description: "run Development server"
	func: run
	examples: [
		desc: "Run on different port, e.g. localhost:2019"
		cmd: "ruui dev --port 2019"
	,
		desc: "Run on different host (ip), e.g. 192.168.1.9:3000"
		cmd: "ruui dev --host 192.168.1.9"
	]
	options: [
		command: "--port [number]"
		default: ruui.port
		description: "Specify port for development server"
		parse: (val) -> Number(val)
	,
		command: "--host [string]"
		default: ruui.host
		description: "Specify host for development server"
	,
		command: "-d, --devOnly"
		description: "Don't run server-side-rendering server"
	]
