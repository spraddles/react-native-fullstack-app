import express from 'express'
import { supabase } from './../../utils/supabase.js'

export default function () {
	const router = express.Router()

	router.get('/card', async (req, res, next) => {
		try {
			const supabaseUser = await supabase.auth.getUser(req.token)
			const supabaseUserID = supabaseUser?.data?.user?.id
			const { data, error } = await supabase
				.from('cards')
				.select()
				.eq('user_id', supabaseUserID)
			if (error) {
				console.log('Supabase error:', error)
				throw new Error(error.message)
			}
			console.log('data: ', data)
			if (data.length) {
				// add merchant API here
				// getCardDetailsFromMerchant(data[0].id)
				const tempCardDetailsFromMerchant = {
					last4digits: '4298',
					flag: 'Mastercard'
				}
				return res.status(200).json({
					status: true,
					data: tempCardDetailsFromMerchant
				})
			}
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
