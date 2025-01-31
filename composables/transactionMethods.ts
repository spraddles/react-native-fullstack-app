import { supabase } from '@/supabase/connect'
import { apiFetch } from '@/composables/api'

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
		const url = process.env.EXPO_PUBLIC_SERVER_URL + '/api/transactions/create'
		const apiFetchResponse = await apiFetch(url, {
			method: 'POST',
			body: JSON.stringify(data)
		})
		if (apiFetchResponse.ok || apiFetchResponse.status === 200) {
			return { status: true }
		} else {
			return { status: false }
		}
	} catch (error) {
		console.log('error: ', error)
		return { status: false }
	}
}
