import { supabase } from '@/supabase/connect'

export const fetchTransactions = async () => {
	const supabaseUser = await supabase.auth.getUser()
	const supabaseUserID = supabaseUser?.data?.user?.id

	const transactions = await supabase
		.from('transactions')
		.select()
		.eq('sender_id', supabaseUserID)

	console.log('fetchTransactions: ', transactions)
	return transactions
}

export const createTransaction = async (data: object) => {
	try {
		const supabaseUser = await supabase.auth.getUser()
		const supabaseUserID = supabaseUser?.data?.user?.id

		const object = {
			sender_id: supabaseUserID,
			...data
		}

		console.log('createTransaction: object ', object)

		const insertTransactionCommand = await supabase
			.from('transactions')
			.insert(object)
			.eq('user_id', supabaseUserID)
			.select()
			.single()

		console.log('insertCommand: ', insertTransactionCommand)

		return { status: true }
	} catch (error) {
		return { status: false, message: `Could not create transaction: ${error}` }
	}
}
