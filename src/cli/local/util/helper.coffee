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

getTerminalTheme = ->
	switch process.platform
		when "darwin" then darwinTerminalTheme
		else defaultTerminalTheme

isDirectory = (source) -> fs.lstatSync(source).isDirectory()

module.exports =
	terminalTheme: getTerminalTheme()
	ruuiModule: (ext...) -> path.resolve(process.cwd(), "node_modules", "react-universal-ui", ext...)
	ruuiCliModule: (ext...) -> path.resolve(process.cwd(), "node_modules", "react-universal-ui", "js", "cli", "local", ext...)
	rnCliModule: (ext...) -> path.resolve(process.cwd(), "node_modules", "react-native", "local-cli", ext...)
	isDirectory: isDirectory
	getDirectories: (source) -> fs.readdirSync(source).map((name) -> path.join(source, name)).filter(isDirectory)
	templateExclusions: ["dependencies.json", "devDependencies.json", ]
