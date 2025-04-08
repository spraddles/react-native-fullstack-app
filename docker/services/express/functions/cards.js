import { supabase } from './../utils/supabase.js'
import { chargeCard } from '../functions/external/starkbank/index.js'
import { convertExpiryDateFormat } from './../utils/inputFormatter.js'

export const getExistingCard = async (userID) => {
	try {
		const { data, error } = await supabase
			.from('cards')
			.select('*')
			.eq('user_id', userID)
			.single()
		// supabase bug: returns PGRST116 error when no rows exist
		if (error && error.code === 'PGRST116') {
			return false
		}
		// handle other errors
		if (error) {
			console.error('Error checking for existing card:', error)
			return null
		}
		return data
	} catch (error) {
		console.error('Error in getExistingCard:', error)
		return null
	}
}

export const createCard = async (cardData) => {
	try {
		// create fake charge 1st: to add card to StarkBank
		const card = {
			cardNumber: cardData.cardNumber,
			cardExpiration: convertExpiryDateFormat(cardData.cardExpiration),
			cardSecurityCode: cardData.cardSecurityCode,
			fundingType: cardData.type,
			holderName: cardData.holderName
		}

		// always set $0 dollar charge to save card
		const charge = await chargeCard(card, 0)

		if (!charge.success) {
			console.error('Error creating card with acquirer:', charge.message)
			return false
		}

		const insertObject = {
			user_id: cardData.user,
			external_id: charge.data.card_id,
			type: cardData.type,
			country: cardData.country,
			bank_name: cardData.bank,
			network: cardData.network,
			last_4_digits: charge.data.last_4_digits
		}

		const { data, error } = await supabase
			.from('cards')
			.insert([insertObject])
			.select('id')
			.single()
		if (error) {
			console.error('Error creating card:', error)
			return false
		}
		return data
	} catch (error) {
		console.error('Error in createCard:', error)
		return false
	}
}

/*
 ** Note: the deleteCard() function only deletes cards locally
 ** and not with the acquirer, e.g. StarkBank
 */

export const deleteCard = async (cardID) => {
	try {
		// delete functions return NULL when successful
		const { data, error } = await supabase.from('cards').delete().eq('id', cardID)
		if (error) {
			console.error('Error deleting card:', error)
			return false
		}
		return true
	} catch (error) {
		console.error('Error in deleteCard:', error)
		return false
	}
}
