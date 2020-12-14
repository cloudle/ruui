path = require("path")
commander = require(path.resolve(process.cwd(), "node_modules", "commander"))
webpack = require(path.resolve(process.cwd(), "node_modules", "webpack"))
webpackDevServer = require(path.resolve(process.cwd(), "node_modules", "webpack-dev-server"))
chalk = require(path.resolve(process.cwd(), "node_modules", "chalk"))

module.exports = {
	commander,
	webpack,
	webpackDevServer,
	chalk,
}
