import createError from 'http-errors'
import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import { validateToken } from './utils/auth.js'
// transactions
import getTransactions from './routes/transactions/all.js'
import createTransaction from './routes/transactions/create.js'
import setTransactionStatus from './routes/transactions/setStatus.js'
// cards
import getCard from './routes/cards/get.js'
import createCard from './routes/cards/create.js'
import chargeCard from './routes/cards/charge.js'
// user
import getUser from './routes/user/get.js'
import updateUser from './routes/user/update.js'
// other
import getPublicKey from './routes/auth/publicKey.js'
import isEnoughFunds from './routes/account/isEnoughFunds.js'

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
app.use('/cards', chargeCard())
app.use('/user', getUser())
app.use('/user', updateUser())
app.use('/auth', getPublicKey())
app.use('/account', isEnoughFunds())

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
