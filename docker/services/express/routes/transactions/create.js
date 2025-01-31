import express from 'express'
import { stripFormat } from './../../utils/inputFormatter.js'
import { supabase } from './../../utils/supabase.js'

export default function () {

	const router = express.Router()

	router.post('/create', async (req, res, next) => {
		try {
			const supabaseUser = await supabase.auth.getUser(req.token)
			const supabaseUserID = supabaseUser?.data?.user?.id
			// clean data first
			const cleanData = {
				amount: stripFormat(req.body.amount),
				digital_wallet: req.body.digital_wallet,
				pix_method: req.body.pix_method,
				pix_method_value: stripFormat(req.body.pix_method_value),
				receiver: req.body.receiver
			}
			// append id
			const object = {
				sender_id: supabaseUserID,
				...cleanData
			}
			const supabaseResponse = await supabase
				.from('transactions')
				.insert(object)
				.eq('user_id', supabaseUserID)
				.select()
				.single()
			return res.status(200).json({
				status: true
			})
		} catch (error) {
			console.log('Create transaction error: ', error)
			return res
				.status(500)
				.json({ status: false, message: `Could not create transaction: ${error}` })
		}
	})
	return router
}
