import express from 'express'
import { supabase } from '../../utils/supabase.js'

export default function () {
	const router = express.Router()

	router.post('/update', async (req, res) => {
		try {
			const data = req.body.data
            const transactionID = data.id

			// check inputs exist
			if (!transactionID) {
				return res.status(400).json({
					status: false,
					message: 'Transaction ID is required'
				})
			}

			// Ensure data is not empty
			if (Object.keys(data).length === 0) {
				return res.status(400).json({
					status: false,
					message: 'No update data provided'
				})
			}

			const { error } = await supabase
				.from('transactions')
				.update(data)
				.eq('id', transactionID)
				.select()
				.single()

			if (error) {
				console.error('Update error:', error)
				return res.status(400).json({
					status: false,
					message: 'Failed to update transaction'
				})
			}
			return res.status(200).json({
				status: true
			})
		} catch (error) {
			console.error('Update transaction error:', error)
			return res.status(500).json({
				status: false,
				message: 'Server error while updating transaction'
			})
		}
	})
	return router
}