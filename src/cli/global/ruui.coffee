fs = require("fs")
path = require("path")
childProcess = require("child_process")
chalk = require("chalk")
prompt = require("prompt")
semver = require("semver")
options = require("minimist")(process.argv.slice 2)
ruuiInstruction = """
Usage: ruui [command] [options]

Commands:
	init <ProjectName> [options]  generates a new project and installs its dependencies

Options:
	-h, --help    output usage information
	-v, --version use a specific version of React Universal UI
	--template use an app template. Use --template to see available templates.

"""
ruuiNoCommandMessage = "You did not pass any commands, run `ruui --help` to see a list of all available commands."
ruuiInitUsage = "Usage: react-native init <ProjectName> [--verbose]"
ruuiUnrecognizedCommand = (command) -> "Command #{command} unrecognized. Make sure that you have run `npm install` and that you are inside RUUI project."
ruuiInvalidProjectName = (name) -> "#{name} is not a valid name for a project. Please use a valid identifier name (alphanumeric)."
ruuiInvalidProjectKeyword = (name) -> "#{name} is not a valid name for a project. Please do not use the reserved word \"React\"."
ruuiInvalidNodeVersion = (current, required) -> """
You are currently running Node #{current} but React Native requires #{required}.
Please use a supported version of Node.
See https://facebook.github.io/react-native/docs/getting-started.html
"""

modulePath = () -> path.resolve.apply(null, [process.cwd(), "node_modules"].concat(Object.values(arguments)))
packageJsonPath = (module = "react-native") -> path.resolve(process.cwd(), "node_modules", module, "package.json")

printVersionAndExit = (ruuiPackageJsonPath) ->
	console.log("ruui-cli: #{require("./package.json").version}")
	try console.log("react-universal-ui: #{require(ruuiPackageJsonPath).version}")
	catch err then console.log("react-universal-ui: n/a - not inside a React Universal UI project directory")
	process.exit()

printVersionAndExit(packageJsonPath("react-universal-ui")) if options._.length is 0 and (options.v or options.version)

cli = null # <- check if current project contain it's own cli then use it, otherwise try to load cli from react-universal-ui
innerLocalCliPath = path.resolve(process.cwd(), "cli.js") # <- local-cli of production run
outerLocalCliPath = path.resolve(process.cwd(), "../../cli.js") # <- local-cli of development run
installedCliPath = modulePath("react-universal-ui", "cli.js") # <- default local-cli of ruui

if fs.existsSync(innerLocalCliPath) then cli = require(innerLocalCliPath)
else if fs.existsSync(outerLocalCliPath) then cli = require(outerLocalCliPath)
else if fs.existsSync(installedCliPath) then cli = require(installedCliPath)
commands = options._

getYarnVersionIfAvailable = ->
	yarnVersion = null
	versionCommand = if process.platform.startsWith("win") then "yarn --version 2> NUL" else "yarn --version 2>/dev/null"

	try yarnVersion = (childProcess.execSync(versionCommand).toString() or "").trim()
	catch err then return null

	try return if (semver.gte(yarnVersion, "0.16.0")) then yarnVersion else null
	catch err
		console.error "Cannot parse yarn version: #{yarnVersion}"
		return null

init = (name, opts) ->
	validateProjectName(name)
	if fs.existsSync(name) then createAfterConfirmation(name, opts)
	else createProject(name, opts)

run = (root, projectName, opts) ->
	rnPackage = opts.version
	forceNpmClient = opts.npm
	yarnVersion = not forceNpmClient and getYarnVersionIfAvailable()
	rnPackage = getInstallPackage(rnPackage)
	ruuiPackage = if fs.existsSync(path.resolve(process.cwd(), "../../cli.js")) then "file:#{path.resolve(process.cwd(), "../../")}" else getInstallPackage("react-universal-ui")
	packagesToInstall = "#{rnPackage} #{ruuiPackage}"
	installCommand = ""

	if opts.installCommand
		installCommand = opts.installCommand
	else
		if yarnVersion
			console.log "Using yarn v #{yarnVersion}"
			installCommand = "yarn add #{packagesToInstall} --exact"
		else
			console.log "Consider installing yarn to make this faster: https://yarnpkg.com" unless forceNpmClient
			installCommand = "npm install --save --save-exact #{packagesToInstall}"

		installCommand += " --verbose" if opts.verbose
		console.log "Installing #{rnPackage}, #{ruuiPackage}."

	try
		childProcess.execSync(installCommand, { stdio: "inherit" })
	catch err
		console.error(err)
		console.error("Command #{installCommand} failed.")
		process.exit(1)

	checkNodeVersion()
	rnCli = require(modulePath("react-native", "cli.js"))
	ruuiInit = require(modulePath("react-universal-ui", "dist", "cli", "local", "commands", "init"))

	rnInit = rnCli.init(root, projectName, opts)

	if rnInit.then
		rnInit.then -> ruuiInitializer(ruuiInit, root, projectName, opts)
		rnInit.catch (error) -> console.log "React Native failed, #{error}"
	else
		ruuiInitializer(ruuiInit, root, projectName, opts)

ruuiInitializer = (initCommand, root, projectName, opts) ->
	initCommand(root, projectName, opts)
	defaultAppPath = path.resolve(root, "App.js")
	fs.unlinkSync(defaultAppPath) if fs.existsSync(defaultAppPath)

validateProjectName = (name) ->
	(console.log(ruuiInvalidProjectName(name)); process.exit(1)) unless String(name).match(/^[$A-Z_][0-9A-Z_$]*$/i)
	(console.log(ruuiInvalidProjectKeyword(name)); process.exit(1)) if (name is "React")

createAfterConfirmation = (name, opts) ->
	prompt.start()
	property =
		name: "yesno"
		message: "Directory #{name} already exists. Continue?"
		validator: /y[es]*|n[o]?/
		warning: "Must respond yes or no"
		default: "no"

	prompt.get property, (err, result) ->
		if result.yesno[0] is "y" then createProject(name, opts)
		else (console.log("Project initialization canceled"); process.exit(1))

createProject = (name, opts) ->
	root = path.resolve(name)
	projectName = path.basename(root)
	packageJson =
		name: projectName
		version: "0.0.1"
		private: true
		scripts:
			start: "node node_modules/react-native/local-cli/cli.js start"
			ios: "react-native run-ios"
			android: "react-native run-android"

	fs.mkdirSync(root) unless fs.existsSync(root)
	fs.writeFileSync(path.join(root, "package.json"), JSON.stringify(packageJson))
	process.chdir(root)
	run(root, projectName, opts)

getInstallPackage = (chosenPackage, defaultPackage = "react-native") ->
	packageToInstall = defaultPackage
	isValidSemver = semver.valid(chosenPackage)
	if isValidSemver then packageToInstall = "#{defaultPackage}@#{isValidSemver}"
	else if chosenPackage then packageToInstall = chosenPackage
	packageToInstall

checkNodeVersion = ->
	packageJson = require(packageJsonPath())
	invalidEngine = !semver.satisfies(process.version, packageJson.engines.node)
	return if !packageJson.engines or !packageJson.engines.node
	console.error(chalk.red(ruuiInvalidNodeVersion(process.version, packageJson.engines.node))) if invalidEngine

if cli then cli.run() else
	(console.log(ruuiInstruction); process.exit(1)) if options._.length is 0 and (options.h or options.help)
	(console.log(ruuiNoCommandMessage); process.exit(1)) if commands.length is 0

	switch commands[0]
		when "init"
			unless commands[1] then (console.error(ruuiInitUsage); process.exit(1)) else
				init(commands[1], options)
			break;
		else (console.error(ruuiUnrecognizedCommand(commands[0])); process.exit(1))
