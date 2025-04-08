import express from 'express'
import { decryptData } from './../../utils/decrypt.js'
import { supabase } from './../../utils/supabase.js'
import { getExistingCard, createCard, deleteCard } from './../../functions/cards.js'

export default function () {
	const router = express.Router()

	router.post('/create', async (req, res, next) => {
		try {
			const supabaseUser = await supabase.auth.getUser(req.token)
			const supabaseUserID = supabaseUser?.data?.user?.id

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

			// get existing card
			const existingCard = await getExistingCard(supabaseUserID)

			// create new card locally
			const cardData = {
				user: supabaseUserID,
				country: decryptedData.country,
				bank: decryptedData.bank,
				type: decryptedData.type,
				network: decryptedData.network,
				cardNumber: decryptedData.number,
				cardExpiration: decryptedData.expiry,
				cardSecurityCode: decryptedData.cvv,
				holderName: decryptedData.holder
			}

			// starkbank API will create card externally
			const newCard = await createCard(cardData)
			if (!newCard) {
				return res.status(500).json({
					status: false,
					message: "Can't create card in database"
				})
			}

			// delete old card (therefore only keeping 1 card)
			const deleteOldCard = await deleteCard(existingCard.id)
			if (!deleteOldCard) {
				return res.status(500).json({
					status: false,
					message: 'Failed to delete existing card'
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
