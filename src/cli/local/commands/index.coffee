fs = require("fs")
{ electronModule } = require("../util/helper")

initMessage = """
Looks like we're already in a React Universal UI project folder
We should run this command from a different folder instead..
"""

initCommand =
	name: "init"
	func: -> console.log(initMessage)

commands = [
	require("./dev")
	require("./bundle")
	require("./extends")
	require("./electron")
	initCommand
]

module.exports = commands
