fs = require("fs")
path = require("path")
childProcess = require("child_process")
{ execSync } = childProcess

installDependencies = (depencencies, yarnVersion, isDev) ->
	return if Object.keys(depencencies).length is 0

	dependencyType = if isDev then "develop dependencies" else "dependencies"
	console.log("Setting up #{dependencyType}.")

	for name of depencencies
		version = depencencies[name]
		depToInstall = if version then "#{name}@#{version} " else name
		console.log("Adding #{depToInstall}...")

		if yarnVersion
			saveType = if isDev then " -D" else ""
			execSync("yarn add #{depToInstall}#{saveType} --save-exact", { stdio: "inherit" })
		else
			saveType = if isDev then " --save-dev" else " --save"
			execSync("npm install #{depToInstall}#{saveType} --save-exact", { stdio: "inherit" })

module.exports = { installDependencies }
