import express from 'express'
import { getAccountBalance } from './../../functions/account.js'

export default function () {
	const router = express.Router()

	router.post('/is-enough-funds', async (req, res, next) => {
		try {
			const minFunds = 1000
			const accountBalance = await getAccountBalance()
			const transactionValue = req.body.transactionValue
			if (!accountBalance) {
				return res.status(500).json({
					error: 'Account balance error'
				})
			}
			if (transactionValue < accountBalance - minFunds) {
				return res.status(200).json({
					status: true
				})
			}
			return res.status(200).json({
				status: false
			})
		} catch (error) {
			console.log('Get account balance error:', error)
			return res.status(500).json({
				status: false,
				message: 'Could not get account balance'
			})
		}
	})
	return router
}
