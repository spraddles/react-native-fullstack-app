/*
 ** Note: user profile database transactions are ok to be
 ** managed directly from the frontend, as Supabase has
 ** RLS (row level security) but more sensitive transactions
 ** like financial transactions, will be managed on the backend
 */

import { supabase } from '@/supabase/connect'
import countries from '@/assets/data/countries.json'

export const hasOnboarded = async (email) => {
	try {
		const user = await supabase.rpc('get_user_by_email', {
			email_param: email
		})
		const onboardCheck = await supabase
			.from('user_meta')
			.select('has_onboarded')
			.eq('user_id', user.data[0].id)
			.single()
		// true
		if (onboardCheck?.data?.has_onboarded === true) {
			return true
		}
		// false
		if (onboardCheck.data === null || onboardCheck?.data?.has_onboarded === false) {
			return false
		} else {
			return false
		}
	} catch (error) {
		console.error('Error checking onboarding status:', error)
		return {
			success: false,
			error: error.message
		}
	}
}

export const getCountry = (code: string) => {
	if (!code) {
		return {}
	}
	return countries.find((c) => c.code === code.toUpperCase()) || null
}
