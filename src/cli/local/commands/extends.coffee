fs = require("fs")
path = require("path")
chalk = require("chalk")
{ ruuiModule, ruuiCliModule, rnCliModule, isDirectory, getDirectories, dotFilePath, templateExclusions } = require("../util/helper")

run = (argv, config, args) ->
	addon = args.addon
	availableAddons = getDirectories(path.resolve(ruuiModule("cli", "addons")))
		.map((source) -> path.relative(ruuiModule("cli", "addons"), source))
		.filter((name) -> name isnt "core")
	walk = require(rnCliModule("util/walk"))
	copyAndReplace = require(rnCliModule("util/copyAndReplace"))
	yarn = require(rnCliModule("util/yarn"))
	yarnVersion = yarn.getYarnVersionIfAvailable() and yarn.isGlobalCliUsingYarn(process.cwd())
	templates = require("../util/templates")

	unless availableAddons.indexOf(addon) >= 0
		console.log(chalk.gray("failed to install, addon #{chalk.red(addon)} does not exists, available addons:"))
		console.log(chalk.green("[#{availableAddons.join(", ")}]"))
		return

	dependencies = {}; devDependencies = {}
	addonPath = path.resolve(ruuiModule("cli", "addons/#{addon}"))
	dependenciesPath = path.resolve(addonPath, "dependencies.json")
	devDependenciesPath = path.resolve(addonPath, "devDependencies.json")
	dependencies = Object.assign(dependencies, require(dependenciesPath)) if fs.existsSync(dependenciesPath)
	devDependencies = Object.assign(devDependencies, require(devDependenciesPath)) if fs.existsSync(devDependenciesPath)

	walk(addonPath).forEach (absoluteSrcPath) ->
		relativeFilePath = path.relative(addonPath, absoluteSrcPath)
		relativeRenamedPath = dotFilePath(relativeFilePath)
		absoluteDestinationPath = path.resolve(process.cwd(), relativeRenamedPath)

		return if templateExclusions.indexOf(relativeRenamedPath) >= 0
		copyAndReplace(absoluteSrcPath, absoluteDestinationPath, {})

	templates.installDependencies(dependencies, yarnVersion, false)
	templates.installDependencies(devDependencies, yarnVersion, true)

module.exports =
	name: "extends"
	description: "setup additional feature to current project"
	func: run
	examples: [
		desc: "install eslint (AirBnB) and dependencies"
		cmd: "ruui extends --addon eslint"
	],
	options: [
		command: "--addon [string]"
		description: "feature to extends e.g 'eslint'"
	]
