import createError from 'http-errors'
import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import routes from './routes/index.js'

const app = express()

// add-ons
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// routes
app.use('/api', routes())

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
