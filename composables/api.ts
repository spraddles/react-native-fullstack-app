import { supabase } from '@/supabase/connect'

export const apiFetch = async (url, options = {}) => {
	try {
		const supabaseUser = await supabase.auth.getSession()
		const token = supabaseUser.data.session.access_token
		// token exists
		if (token) {
			const defaultHeaders = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
            const fetchUrlResponse = fetch(url, {
				...options,
				headers: {
					...defaultHeaders,
					...options.headers
				}
			})
			return fetchUrlResponse
		}

		// no token
		else {
			return {
				status: false,
				message: 'Did not attempt fetch as no token was found'
			}
		}
	} catch (error) {
		console.log('error: ', error)
	}
}
