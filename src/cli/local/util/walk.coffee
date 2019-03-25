fs = require("fs")
path = require("path")

walk = (current) ->
	return [current] unless fs.lstatSync(current).isDirectory()
	files = fs.readdirSync(current).map((child) -> walk(path.join(current, child)))
	[].concat.apply([current], files)

module.exports = walk
