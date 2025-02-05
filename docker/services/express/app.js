import createError from 'http-errors'
import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import getTransactions from './routes/transactions/all.js'
import createTransaction from './routes/transactions/create.js'
import setTransactionStatus from './routes/transactions/setStatus.js'
import { validateToken } from './utils/auth.js'

const app = express()

// add-ons
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// Add this before any other middleware: for debugging
app.use((req, res, next) => {
	console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
	next()
})

// middleware
app.use('/api/*', validateToken)

// routes
app.use('/api/transactions', getTransactions())
app.use('/api/transactions', createTransaction())
app.use('/api/transactions', setTransactionStatus())

// for debugging
app.get('/hello', (req, res) => {
	res.send('Hello World!')
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
	next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}
	// render the error
	res.status(err.status || 500).json({
		message: err.message,
		error: res.locals.error
	})
})

export default app
