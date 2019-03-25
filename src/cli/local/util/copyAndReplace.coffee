fs = require("fs")
path = require("path")
binaryExtensions = [".png", ".jar"]

copyBinaryFile = (srcPath, destPath, cb) ->
	cbCalled = false
	done = (err) -> (cb(err); cbCalled = true) unless cbCalled
	srcPermissions = fs.statSync(srcPath).mode
	readStream = fs.createReadStream(srcPath)
	readStream.on 'error', (err) -> done(err)
	writeStream = fs.createWriteStream destPath, { mode: srcPermissions, }
	writeStream.on 'error', (err) -> done(err)
	writeStream.on 'close', () -> done()
	readStream.pipe(writeStream)

copyAndReplace = (srcPath, destPath, replacements, contentChangedCallback) ->
	if fs.lstatSync(srcPath).isDirectory()
		fs.mkdirSync(destPath) unless fs.existsSync(destPath)
		return

	extension = path.extname(srcPath)
	unless binaryExtensions.indexOf(extension) is -1 # <- Binary file
		shouldOverwrite = "overwrite"

		if contentChangedCallback
			newContentBuffer = fs.readFileSync(srcPath)
			contentChanged = "identical"

			try
				origContentBuffer = fs.readFileSync(destPath)
				contentChanged = "changed" unless Buffer.compare(origContentBuffer, newContentBuffer) is 0
			catch error
				if error.code is "ENOENT" then contentChanged = "new" else throw err

			shouldOverwrite = contentChangedCallback(destPath, contentChanged)

		copyBinaryFile(srcPath, destPath, (err) -> throw err if err) if shouldOverwrite is "overwrite"
	else # <- Text file
		srcPermissions = fs.statSync(srcPath).mode
		content = fs.readFileSync(srcPath, 'utf8')
		Object.keys(replacements).forEach (regex) ->
			content = content.replace(new RegExp(regex, "g"), replacements[regex])

		shouldOverwrite = "overwrite"
		if contentChangedCallback
			contentChanged = "identical"
			try
				origContent = fs.readFileSync(destPath, "utf8")
				contentChanged = "changed" unless content is origContent
			catch err
				if err.code is "ENOENT" then contentChanged = "new" else throw err

			shouldOverwrite = contentChangedCallback(destPath, contentChanged)

		fs.writeFileSync(destPath, content, { encoding: 'utf8', mode: srcPermissions, }) if shouldOverwrite is "overwrite"

module.exports = copyAndReplace
