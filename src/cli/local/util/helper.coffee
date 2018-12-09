fs = require("fs")
path = require("path")
chalk = require("chalk")

defaultTerminalTheme =
	prefix: chalk.gray('[')
	suffix: chalk.gray(']')
	progressbar:
		prefix: '['
		suffix: ']'
		complete: '#'
		remaining: '.'

darwinTerminalTheme = Object.assign defaultTerminalTheme,
	prefix: chalk.gray('｢')
	suffix: chalk.gray('｣')
	progressbar:
		prefix: '⸨'
		suffix: '⸩'
		complete: '#'
		remaining: '-'

getJson = (path, fallback = {}) -> if fs.existsSync(path) then require(path) else fallback
writeFile = (file, data) ->
	dirname = path.dirname(file)
	fs.mkdirSync(dirname, { recursive: true }) unless fs.existsSync(dirname)
	fs.writeFileSync(file, data)

getTerminalTheme = ->
	switch process.platform
		when "darwin" then darwinTerminalTheme
		else defaultTerminalTheme

isPortTaken = (options) ->
	new Promise (resolve, reject) ->
		server = require("net").createServer()
			.once("listening", -> handlePortAvailable(server, resolve))
			.once("error", (error) -> handlePortTaken(error, resolve, reject))
			.listen(options)

handlePortAvailable = (server, resolve) -> server.once("close", -> resolve(false)).close()
handlePortTaken = (error, resolve, reject) ->
	reject(error) unless (error.code is "EADDRINUSE")
	resolve(true)

dotFilePath = (filePath) ->
	return filePath unless filePath
	return filePath
		.replace("_eslintrc", ".eslintrc")
		.replace("_gitignore", ".gitignore")
		.replace("_gitattributes", ".gitattributes")
		.replace("_babelrc", ".babelrc")
		.replace("_flowconfig", ".flowconfig")
		.replace("_buckconfig", ".buckconfig")
		.replace("_watchmanconfig", ".watchmanconfig")

isDirectory = (source) -> fs.lstatSync(source).isDirectory()
setEnv = (opts) -> Object.keys(opts).forEach (key) -> process.env[key] = opts[key]
uuid = -> "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace /[xy]/g, (c) ->
	r = Math.random() * 16|0; v = if c is "x" then r else (r&0x3|0x8)
	v.toString(16)

module.exports = {
	terminalTheme: getTerminalTheme()
	localModule: (ext...) -> path.resolve(process.cwd(), ext...)
	ruuiModule: (ext...) -> path.resolve(process.cwd(), "node_modules", "react-universal-ui", ext...)
	electronModule: (ext...) -> path.resolve(process.cwd(), "node_modules", "electron", ext...)
	ruuiCliModule: (ext...) -> path.resolve(process.cwd(), "node_modules", "react-universal-ui", "js", "cli", "local", ext...)
	rnCliModule: (ext...) -> path.resolve(process.cwd(), "node_modules", "react-native", "local-cli", ext...)
	isDirectory: isDirectory
	getDirectories: (source) -> fs.readdirSync(source).map((name) -> path.join(source, name)).filter(isDirectory)
	templateExclusions: ["dependencies.json", "devDependencies.json", ]
	isPortTaken
	dotFilePath
	writeFile
	getJson
	setEnv
	uuid
}
