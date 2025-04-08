import { supabase } from './../utils/supabase.js'

export const createTransaction = async (transaction) => {
	try {
		const { data, error } = await supabase
			.from('transactions')
			.insert(transaction)
			.select()
			.single()
		if (error) {
			console.error('Error creating transaction:', error)
			return false
		}
		return data
	} catch (error) {
		console.error('Error in createTransaction:', error)
		return false
	}
}

export const createCardTransaction = async (transaction) => {
	try {
		const { data, error } = await supabase
			.from('card_transactions')
			.insert([transaction])
			.select('id')
			.single()
		if (error) {
			console.error('Error creating card transaction:', error)
			return false
		}
		return data
	} catch (error) {
		console.error('Error in createCardTransaction:', error)
		return false
	}
}