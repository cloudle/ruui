fs = require("fs")
path = require("path")
childProcess = require("child_process")
{ chalk, } = require("../util/modules")
{ ruui } = require("../util/configs")
{ electronModule, isPortTaken } = require("../util/helper")

run = (argv, config, args) ->
	electronPath = electronModule("index.js")
	(console.log(electronNotFound); process.exit(1)) unless fs.existsSync(electronPath)

	host = ruui.host(); port = ruui.port()
	runningHost = if host is "0.0.0.0" then "localhost" else host
	serverPortTaken = await isPortTaken({ port: ruui.port(), host: ruui.host() })

	console.log("launching electron..")
	unless (serverPortTaken)
		console.log("preparing development server at #{runningHost}:#{chalk.gray(port)}")

		devServer = require("../tools/webpack.devserver")()
		devServer.listen port, host or "0.0.0.0", (error, result) ->
			console.log(error) if error
			true
		setTimeout (-> launchElectron(electronPath)), 0
	else
		console.log("development server already running at #{runningHost}:#{chalk.gray(port)}")
		launchElectron(electronPath)

launchElectron = (electronPath) ->
	electron = require(electronPath)
	child = childProcess.spawn electron, ["-r", "@babel/register", "./electron"],
		cwd: process.cwd()
		stdio: "inherit"

	child.on "close", (code) -> process.exit(code)

electronNotFound = """
Cannot locate #{chalk.magenta("electron")} package,
run `#{chalk.green("ruui extends --addon electron")}` to install it.."""

module.exports =
	name: "electron"
	description: 'launch your app using Electron'
	func: run
