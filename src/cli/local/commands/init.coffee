fs = require("fs")
path = require("path")
chalk = require("chalk")
{ ruuiModule, ruuiCliModule, rnCliModule, isDirectory, getDirectories, dotFilePath, templateExclusions } = require("../util/helper")

init = (root, argsOrName, opts) ->
	template = opts["extends"]
	availableTemplates = getDirectories(path.resolve(ruuiModule("cli", "templates")))
		.map((source) -> path.relative(ruuiModule("cli", "templates"), source))
		.filter((name) -> name isnt "core")
	walk = require(rnCliModule("util/walk"))
	copyAndReplace = require(rnCliModule("util/copyAndReplace"))
	yarn = require(rnCliModule("util/yarn"))
	yarnVersion = !opts.npm and yarn.getYarnVersionIfAvailable() and yarn.isGlobalCliUsingYarn(root)
	templates = require('../util/templates')
	args = if Array.isArray(argsOrName) then argsOrName else [argsOrName].concat(process.argv.slice(4))
	newProjectName = args[0]
	templateReplacements =
		"Hello App Display Name": newProjectName
		'HelloWorld': newProjectName
		'helloworld': newProjectName.toLowerCase()
	dependencies = {}; devDependencies = {}
	coreTemplatePath = path.resolve(ruuiModule("cli", "templates/core"))
	coreDependenciesPath = path.resolve(coreTemplatePath, "dependencies.json")
	coreDevDependenciesPath = path.resolve(coreTemplatePath, "devDependencies.json")

	dependencies = Object.assign(dependencies, require(coreDependenciesPath)) if fs.existsSync(coreDevDependenciesPath)
	devDependencies = Object.assign(devDependencies, require(coreDevDependenciesPath)) if fs.existsSync(coreDevDependenciesPath)

	walk(coreTemplatePath).forEach (absoluteSrcPath) ->
		relativeFilePath = path.relative(coreTemplatePath, absoluteSrcPath)
		relativeRenamedPath = dotFilePath(relativeFilePath)
		absoluteDestinationPath = path.resolve(root, relativeRenamedPath)

		return if templateExclusions.indexOf(relativeRenamedPath) >= 0
		copyAndReplace(absoluteSrcPath, absoluteDestinationPath, templateReplacements)

	if template and template isnt "core"
		if availableTemplates.indexOf(template) >= 0
			childTemplatePath = path.resolve(ruuiModule("cli", "templates/#{template}"))
			childDependenciesPath = path.resolve(childTemplatePath, "dependencies.json")
			childDevDependenciesPath = path.resolve(childTemplatePath, "devDependencies.json")

			dependencies = Object.assign(dependencies, require(childDependenciesPath)) if fs.existsSync(childDependenciesPath)
			devDependencies = Object.assign(devDependencies, require(childDevDependenciesPath)) if fs.existsSync(childDevDependenciesPath)

			walk(childTemplatePath).forEach (absoluteSrcPath) ->
				relativeFilePath = path.relative(childTemplatePath, absoluteSrcPath)
				relativeRenamedPath = dotFilePath(relativeFilePath)
				absoluteDestinationPath = path.resolve(root, relativeRenamedPath)

				return if templateExclusions.indexOf(relativeRenamedPath) >= 0
				copyAndReplace(absoluteSrcPath, absoluteDestinationPath, templateReplacements)
		else
			console.log(chalk.yellow("Couldn't found template with name \"#{template}\", used essential template."))

	templates.installDependencies(dependencies, yarnVersion, false)
	templates.installDependencies(devDependencies, yarnVersion, true)

module.exports = init
