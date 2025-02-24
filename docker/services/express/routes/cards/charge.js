import express from 'express'
import { chargeCard } from './../../functions/cards.js'

export default function () {
	const router = express.Router()

	router.post('/charge', async (req, res, next) => {
		try {
			const charge = await chargeCard(req.body.cardID, req.body.transaction)
			if (charge) {
				return res.status(200).json({
					status: true
				})
			}
			// charge not processed
			return res.status(200).json({
				status: false
			})
		} catch (error) {
			console.log('Charge card error:', error)
			return res.status(500).json({
				status: false,
				message: 'Could not charge card'
			})
		}
	})
	return router
}
