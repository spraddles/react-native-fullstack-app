import { supabase } from '@/supabase/connect'
import { cleanDataByKey } from '@/composables/inputFormatter'

export const fetchTransactions = async () => {
	const supabaseUser = await supabase.auth.getUser()
	const supabaseUserID = supabaseUser?.data?.user?.id

	const transactions = await supabase
		.from('transactions')
		.select()
		.eq('sender_id', supabaseUserID)

	return transactions
}

export const createTransaction = async (data: object) => {
	try {
		const supabaseUser = await supabase.auth.getUser()
		const supabaseUserID = supabaseUser?.data?.user?.id
		// clean data first
		const cleanData = cleanDataByKey(data, ['amount', 'pix_method_value'])
		// append id
		const object = {
			sender_id: supabaseUserID,
			...cleanData
		}
		await supabase
			.from('transactions')
			.insert(object)
			.eq('user_id', supabaseUserID)
			.select()
			.single()
		return { status: true }
	} catch (error) {
		console.log('createTransaction error: ', error)
		return { status: false, message: `Could not create transaction: ${error}` }
	}
}
