{ execSync } = require("child_process")
fs = require("fs")
path = require("path")
semver = require("semver")
logger = require("./logger")

getYarnVersionIfAvailable = () ->
	yarnVersion = null
	try
		yarnVersion = execSync("yarn --version", stdio: [0, 'pipe', 'ignore']).toString() or ""
		yarnVersion = yarnVersion.trim()
	catch error then return null

	try
		return yarnVersion if semver.gte(yarnVersion, "0.16.0")
	catch error
		logger.error "Cannot parse yarn version: #{yarnVersion}"
		return null

isProjectUsingYarn = (projectDir) -> fs.existsSync(path.join(projectDir, 'yarn.lock'))

module.exports = {
	getYarnVersionIfAvailable
	isProjectUsingYarn
}
