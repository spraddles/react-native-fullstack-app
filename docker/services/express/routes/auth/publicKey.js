import express from 'express'

export default function () {
	const router = express.Router()

	router.get('/publickey', async (req, res, next) => {
		try {
			const publicKey = process.env.PUBLIC_KEY_BASE64
			if (!publicKey) {
				return res.status(500).json({
					error: 'Public key not configured'
				})
			}
			return res.status(200).json({
				status: true,
				data: publicKey
			})
		} catch (error) {
			console.log('Send public key error:', error)
			return res.status(500).json({
				status: false,
				message: 'Could not send public key'
			})
		}
	})
	return router
}
