import express from 'express'
import { decryptData } from './../../utils/decrypt.js'
import { supabase } from './../../utils/supabase.js'

export default function () {
	const router = express.Router()

	router.post('/create', async (req, res, next) => {
		try {
			const { data: encryptedData } = req.body

			if (!encryptedData?.encryptedKey || !encryptedData?.encryptedData) {
				return res
					.status(400)
					.json({ status: false, message: 'Invalid encryption payload' })
			}

			const decryptedData = await decryptData(
				encryptedData.encryptedKey,
				encryptedData.encryptedData
			)
			if (!decryptedData) {
				return res.status(400).json({ status: false, message: 'Decryption failed' })
			}

			const { data: supabaseUser, error: userError } = await supabase.auth.getUser(req.token)
			if (userError || !supabaseUser?.user?.id) {
				return res.status(401).json({ status: false, message: 'Unauthorized' })
			}

			const { data, error } = await supabase
				.from('cards')
				.insert([{ user_id: supabaseUser.user.id }])
				.select('id')
				.single()

			if (error) {
				throw Error("Can't create card in database")
			} else {
				// send to merchant
				// sendCardToMerchant(data.id, decryptedData)
				return res.status(200).json({ status: true })
			}
		} catch (error) {
			console.error('Save card error:', error)
			next(error)
		}
	})
	return router
}
