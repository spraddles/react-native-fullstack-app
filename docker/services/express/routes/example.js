import express from 'express'

export default function () {
	const router = express.Router()

	// example
	router.get('/example', async (req, res) => {
		try {
			console.log('router example')
			return res.json({
				example: 'object'
			})
		} catch (error) {
			console.log('error: ', error)
			res.status(500).json({ error: error.message })
		}
	})
	return router
}
