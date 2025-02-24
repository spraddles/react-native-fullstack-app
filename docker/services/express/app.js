import createError from 'http-errors'
import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { validateToken } from './utils/auth.js'
import getTransactions from './routes/transactions/all.js'
import createTransaction from './routes/transactions/create.js'
import setTransactionStatus from './routes/transactions/setStatus.js'
import getCard from './routes/cards/get.js'
import createCard from './routes/cards/create.js'
import getPublicKey from './routes/auth/publicKey.js'

const app = express()

// add-ons
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// handle favicon.ico before auth middleware
app.get('/favicon.ico', (_, res) => res.status(204).end())
app.head('/favicon.ico', (_, res) => res.status(204).end())

// middleware
app.use('/', validateToken)

// routes
app.use('/transactions', getTransactions())
app.use('/transactions', createTransaction())
app.use('/transactions', setTransactionStatus())
app.use('/cards', getCard())
app.use('/cards', createCard())
app.use('/auth', getPublicKey())

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
