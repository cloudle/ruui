fs = require("fs")
path = require("path")

requireModule = (name) ->
	localPath = path.resolve(process.cwd(), "node_modules", name)
	return require(localPath) if fs.existsSync(localPath)
	require(path.resolve(__dirname, name))

commander = requireModule("commander")
webpack = requireModule("webpack")
WebpackDevServer = requireModule("webpack-dev-server")
chalk = requireModule("chalk")

module.exports = {
	commander,
	webpack,
	WebpackDevServer,
	chalk,
}
