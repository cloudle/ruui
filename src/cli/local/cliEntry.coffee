path = require("path")
childProcess = require("child_process")
commands = require("./commands/index")
init = require("./commands/init")
pkg = require("../../../../package.json")
configs = require("./util/configs")
ssrUtils = require("./util/ssr")
{ requireModule, } = require("./util/modules")

chalk = requireModule("chalk")
commander = requireModule("commander")

commander.version(pkg.version)
defaultOptParser = (val) -> val

handleError = (err) ->
	console.error()
	console.error(err.message or err)
	console.error()
	process.exit(1)

printUnknownCommand = (cmdName) ->
	spacing = "  "
	firstLine = if cmdName then "Unrecognized command `#{cmdName}`" else " You didn't pass any command"
	firstLine = chalk.red(firstLine)

	console.log """

	#{spacing}#{firstLine}
	#{spacing}Run #{chalk.cyan("ruui --help")} to see list of all available commands

	"""

addCommand = (command, cfg) ->
	options = command.options or []
	cmd = commander.command(command.name, undefined, { noHelp: !command.description })
		.description(command.description)
		.action ->
			passedOptions = @opts()
			argv = Array.from(arguments).slice(0, -1)

			Promise.resolve()
				.then -> command.func(argv, cfg, passedOptions)
				.catch(handleError)

	options.forEach (opt) ->
		cmd.option(
			opt.command,
			opt.description,
			opt.parse or defaultOptParser,
			if typeof opt.default is "function" then opt.default(cfg) else opt.default)

	cmd.option("--config [string]", "Path to the CLI configuration file")

run = ->
	commands.forEach (cmd) -> addCommand(cmd, {})
	commander.parse(process.argv)
	isValidCommand = commands.find (cmd) -> cmd.name.split(" ")[0] is process.argv[2]

	unless isValidCommand
		printUnknownCommand(process.argv[2])
		return

	commander.help() unless commander.args.length

module.exports = {
	configs
	ssrUtils
	init
	run: ->
		commands.forEach (cmd) -> addCommand(cmd, {})
		commander.parse(process.argv)

		isValidCommand = commands.find (cmd) -> cmd.name.split(' ')[0] is process.argv[2]
		unless isValidCommand
			printUnknownCommand(process.argv[2])
			return

		commander.help() unless commander.args.length
}
