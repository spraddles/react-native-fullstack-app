import express from 'express'
import { supabase } from './../../utils/supabase.js'

export default function () {
	const router = express.Router()

	router.post('/set-status', async (req, res) => {
		try {
			const { id, status, message } = req.body
			// message is optional
			if (!id || !status) {
				return res.status(400).json({
					status: false,
					message: 'ID, status and message are required'
				})
			}
			const { error } = await supabase
				.from('transactions')
				.update({
					status,
					message
				})
				.eq('id', id)
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
