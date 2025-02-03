import { supabase } from '@/supabase/connect'
import { logout } from '@/composables/auth'

export const apiFetch = async (url, options = {}) => {
	try {
		const supabaseUser = await supabase.auth.getSession()
		const token = supabaseUser.data.session?.access_token

		if (!token) {
			return logout('Your session has expired, please login again to continue.')
		}

		// token exists
		const defaultHeaders = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		}
		const response = await fetch(url, {
			...options,
			headers: {
				...defaultHeaders,
				...options.headers
			}
		})
		const responseJson = await response.json()

		// valid token
		if (response.ok || response.status === 200) {
			return responseJson
		}

		// invalid token or unauthorized
		if (response.status === 401) {
			return logout('Your session has expired, please login again to continue.')
		}

		return {
			status: false,
			message: 'Request failed, please try again later.'
		}
	} catch (error) {
		console.log('error: ', error)
		return {
			status: false,
			message: error.message
		}
	}
}
