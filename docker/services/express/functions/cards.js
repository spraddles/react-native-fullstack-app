import { supabase } from './../utils/supabase.js'

export const getExistingCard = async (userID) => {
	try {
		const { data, error } = await supabase
			.from('cards')
			.select('id')
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
		return getCardFromMerchant(data.id)
	} catch (error) {
		console.error('Error in getExistingCard:', error)
		return null
	}
}

export const createCard = async (userID) => {
	try {
		const { data, error } = await supabase
			.from('cards')
			.insert([{ user_id: userID }])
			.select('id')
			.single()
		if (error) {
			console.error('Error creating card:', error)
			return null
		}
		return data
	} catch (error) {
		console.error('Error in createCard:', error)
		return null
	}
}

export const deleteCard = async (userID) => {
	try {
		// deleteCardFromMerchant(cardID) first!
		const { error } = await supabase.from('cards').delete().eq('user_id', userID)
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

export const getCardFromMerchant = (cardID) => {
	// returning temp details as a placeholder
	const tempCardDetailsFromMerchant = {
		last4digits: '4298',
		flag: 'Mastercard'
	}
	return tempCardDetailsFromMerchant
}

export const sendCardToMerchant = async (cardID, cardData) => {
	try {
		// returning true as a placeholder
		console.log(`Sending card ${cardID} to merchant with data:`, cardData)
		return true
	} catch (error) {
		console.error('Error sending card to merchant:', error)
		return false
	}
}

export const deleteCardFromMerchant = (cardID) => {
	try {
		// returning true as a placeholder
		console.log(`Deleting card ${cardID} with merchant.`)
		return true
	} catch (error) {
		console.error('Error deleting card with merchant:', error)
		return false
	}
}
