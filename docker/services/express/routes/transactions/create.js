import express from 'express'
import { stripFormatForNumbers } from './../../utils/inputFormatter.js'
import { supabase } from './../../utils/supabase.js'
import { createTransaction } from './../../functions/transactions.js'

export default function () {
	const router = express.Router()

	router.post('/create', async (req, res, next) => {
		try {
			const supabaseUser = await supabase.auth.getUser(req.token)
			const supabaseUserID = supabaseUser?.data?.user?.id
			// clean data first
			const cleanData = {
				amount: stripFormatForNumbers(req.body.amount),
				digital_wallet: req.body.digital_wallet,
				pix_method: req.body.pix_method,
				pix_method_value: stripFormatForNumbers(req.body.pix_method_value),
				receiver: req.body.receiver,
				status: 'pending',
				message: null
			}
			// append id
			const object = {
				sender_id: supabaseUserID,
				...cleanData
			}
			// start transaction process
			const dbTransaction = await createTransaction(supabaseUserID, object)
			if (dbTransaction) {
				return res.status(200).json({
					status: true,
					data: dbTransaction
				})
			}
		} catch (error) {
			console.log('Create transaction error: ', error)
			return res
				.status(500)
				.json({ status: false, message: `Could not create transaction: ${error}` })
		}
	})
	return router
}
