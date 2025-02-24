import express from 'express'
import { supabase } from './../../utils/supabase.js'
import { getExistingCard } from './../../functions/cards.js'

export default function () {
	const router = express.Router()

	router.get('/get', async (req, res, next) => {
		try {
			const supabaseUser = await supabase.auth.getUser(req.token)
			const supabaseUserID = supabaseUser?.data?.user?.id
			// check existing
			const existingCard = await getExistingCard(supabaseUserID)
			if (existingCard) {
				return res.status(200).json({
					status: true,
					data: existingCard
				})
			}
			// no card found
			return res.status(200).json({
				status: false
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
