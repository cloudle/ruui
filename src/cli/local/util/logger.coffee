chalk = chalk = require(path.resolve(process.cwd(), "node_modules", "chalk"))
SEPARATOR = ', '
verbose = false

formatMessages = (messages) -> chalk.reset(messages.join(SEPARATOR));
success = (messages...) -> console.log "#{chalk.green.bold('success')} #{formatMessages(messages)}"
info = (messages...) -> console.log"#{chalk.cyan.bold('info')} #{formatMessages(messages)}"
warn = (messages...) -> console.warn "#{chalk.yellow.bold('warn')} #{formatMessages(messages)}"
error = (messages...) -> console.error "#{chalk.red.bold('error')} #{formatMessages(messages)}"
debug = (messages...) -> console.log "#{chalk.gray.bold('debug')} #{formatMessages(messages)}" if verbose
log = (messages...) -> console.log "#{formatMessages(messages)}"
setVerbose = (level) -> verbose = level

module.exports = {
	success
	info
	warn
	error
	debug
	log
	setVerbose
};
