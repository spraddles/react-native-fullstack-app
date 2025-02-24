import { supabase } from './../utils/supabase.js'

export const createTransaction = async (userID, transaction) => {
	try {
		const { data, error } = await supabase
			.from('transactions')
			.insert(transaction)
			.eq('user_id', userID)
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
