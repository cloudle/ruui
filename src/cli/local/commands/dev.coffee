fs = require("fs")
childProcess = require("child_process")
chalk = require("chalk")
{ paths, ruui, ruuiJson, appJson } = require("../util/configs")
{ setEnv, localModule, isPortTaken } = require("../util/helper")

run = (argv, config, args) ->
	{ port, ssrPort, host, devOnly } = args
	nodeEntryPath = localModule("index.node.js")
	actualHost = if host is "0.0.0.0" then "localhost" else host

	launchSsr(nodeEntryPath, actualHost, ssrPort) if !devOnly and fs.existsSync(nodeEntryPath)
	setTimeout ->
		launchDevServer(actualHost, port)
	, 1000 # <- it take at least

launchSsr = (nodeEntryPath, host, ssrPort) ->
	try
		port = ssrPort or process.env.PORT or 3005 # <- since port will change for Development and Ssr, we must get it again..
		console.log("Preparing node server at http://#{host}:#{chalk.gray(port)}")
		babelNodePath = localModule("node_modules", "@babel", "node", "bin", "babel-node.js")
		unless fs.existsSync(babelNodePath)
			console.log("couldn't locate babel-node module, make sure @babel/node package installed!")
			return
		childProcess.fork babelNodePath, [nodeEntryPath],
			cwd: process.cwd()
			stdio: "inherit"
	catch error then console.log "error during spawn ssr-server\n", error

launchDevServer = (host, port) ->
	setEnv({ PORT: port })
	console.log("Preparing development server at http://#{host}:#{chalk.gray(port)}")

	devServer = require("../tools/webpack.devserver")()
	devServer.listen port, host, (error, result) ->
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
		command: "--ssr-port [number]"
		default: ruui.ssrPort
		description: "Specify port for sever-side-rendering server"
		parse: (val) -> Number(val)
	,
		command: "--host [string]"
		default: ruui.host
		description: "Specify host for development server"
	,
		command: "-d, --devOnly"
		description: "Don't run server-side-rendering server"
	]
