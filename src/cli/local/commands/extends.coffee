run = (argv, config, args) ->


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
