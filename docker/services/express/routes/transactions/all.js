import express from 'express'
import { supabase } from './../../utils/supabase.js'

export default function () {
	const router = express.Router()

	router.get('/all', async (req, res, next) => {
		try {
			const supabaseUser = await supabase.auth.getUser(req.token)
			const supabaseUserID = supabaseUser?.data?.user?.id
			const { data: transactions, error } = await supabase
				.from('transactions')
				.select()
				.eq('sender_id', supabaseUserID)
			if (error) {
				console.log('Supabase error:', error)
				throw new Error(error.message)
			}
			return res.status(200).json({
				status: true,
				data: transactions
			})
		} catch (error) {
			console.log('Create transaction error:', error)
			return res.status(500).json({
				status: false,
				message: 'Could not get transactions'
			})
		}
	})
	return router
}
