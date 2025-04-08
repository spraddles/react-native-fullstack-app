import express from 'express'
import { calculateFees } from '../../functions/fees.js'

export default function () {
	const router = express.Router()

	router.post('/fees', async (req, res, next) => {
		try {
			const fees = calculateFees(req.body.data.type, req.body.data.amount)
			return res.status(200).json({
				status: true,
				data: {
					fees: fees
				}
			})
		} catch (error) {
			console.log('Calculate fees error:', error)
			return res.status(500).json({
				status: false,
				message: 'Could not calculate fees'
			})
		}
	})
	return router
}
