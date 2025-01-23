import app from './app.js'
import debug from 'debug'
import http from 'http'

const debugLog = debug('new-app:server')

// Normalize a port into a number, string, or false
const normalizePort = (value) => {
	const port = parseInt(value, 10)
	if (isNaN(port)) {
		// named pipe
		return value
	}
	if (port >= 0) {
		// port number
		return port
	}
	return false
}

// Get port from environment and store in Express
const port = normalizePort(process.env.EXPRESS_PORT || 4001)
app.set('port', port)

// Create HTTP server
const server = http.createServer(app)

// Event listener for HTTP server "error" event
const onError = (error) => {
	if (error.syscall !== 'listen') {
		throw error
	}
	const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`
	// handle specific listen errors with friendly messages
	switch (error.code) {
		case 'EACCES':
			console.error(`${bind} requires elevated privileges`)
			process.exit(1)
			break
		case 'EADDRINUSE':
			console.error(`${bind} is already in use`)
			process.exit(1)
			break
		default:
			throw error
	}
}

// Event listener for HTTP server "listening" event
const onListening = async () => {
	const addr = server.address()
	const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
	debugLog(`Listening on ${bind}`)
	// optionally do something on start
	console.log('Express server started')
}

// Listen on provided port, on all network interfaces
server.listen(port)
server.on('error', (error) => onError(error))
server.on('listening', async () => await onListening())
