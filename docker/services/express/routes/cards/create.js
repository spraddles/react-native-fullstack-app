import express from 'express'
import { decryptData } from './../../utils/decrypt.js'
import { supabase } from './../../utils/supabase.js'
import {
	getExistingCard,
	createCard,
	deleteCard,
	sendCardToMerchant
} from './../../functions/cards.js'

export default function () {
	const router = express.Router()

	router.post('/create', async (req, res, next) => {
		try {
			// existing card check & delete
			const supabaseUser = await supabase.auth.getUser(req.token)
			const supabaseUserID = supabaseUser?.data?.user?.id
			const existingCard = await getExistingCard(supabaseUserID)
			if (existingCard) {
				const deleteResult = await deleteCard(supabaseUserID)
				if (!deleteResult) {
					return res.status(500).json({
						status: false,
						message: 'Failed to delete existing card'
					})
				}
			}

			// decrypt data: no existing card so new card is in payload
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

			// create new card
			const newCard = await createCard(supabaseUserID)
			if (!newCard) {
				return res.status(500).json({
					status: false,
					message: "Can't create card in database"
				})
			}

			// send card to merchant
			const sendResult = await sendCardToMerchant(newCard.id, decryptedData)
			if (!sendResult) {
				return res.status(500).json({
					status: false,
					message: 'Failed to send card to merchant'
				})
			}

			return res.status(200).json({ status: true })
		} catch (error) {
			console.error('Save card error:', error)
			next(error)
		}
	})
	return router
}
