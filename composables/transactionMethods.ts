/*
 ** Note: user profile database transactions are ok to be
 ** managed directly from the frontend, as Supabase has
 ** RLS (row level security) but more sensitive transactions
 ** like financial transactions, will be managed on the backend
 */

import { apiFetch } from '@/composables/api'

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
