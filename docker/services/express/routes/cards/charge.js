import express from 'express'
import { getExistingCard } from './../../functions/cards.js'
import { createCardTransaction } from './../../functions/transactions.js'
import { merchantPurchase } from '../../functions/external/starkbank/index.js'
import { supabase } from './../../utils/supabase.js'
import { calculateFees } from './../../functions/fees.js'

export default function () {
	const router = express.Router()

	router.post('/charge', async (req, res, next) => {
		try {
			// get existing card details
			const supabaseUser = await supabase.auth.getUser(req.token)
			const supabaseUserID = supabaseUser?.data?.user?.id
			const existingCard = await getExistingCard(supabaseUserID)

			// calculate fees
			const type = existingCard.type
			const amount = req.body.transaction.amount
			const cardFees = calculateFees(type, amount)

			// charge card
			const totalAmount = Number(amount) + Number(cardFees.total_fee)
			const charge = await merchantPurchase(existingCard, totalAmount)

			// create card transaction DB entry
			const cleanData = {
				fee: cardFees.card_fee,
				external_id: charge.id,
				status: charge.status,
				message: null // need to update this
			}
			const cardTransaction = await createCardTransaction(cleanData)

			if (charge) {
				return res.status(200).json({
					status: true,
					data: {
						amount: amount,
						fees: cardFees,
						total_amount: totalAmount,
						card_transaction_id: cardTransaction.id
					}
				})
			}

			// charge not processed
			return res.status(402).json({
				status: false
			})
		} catch (error) {
			console.log('Charge card error:', error)
			return res.status(402).json({
				status: false,
				message: 'Could not charge card'
			})
		}
	})
	return router
}
