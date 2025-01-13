import { supabase } from '@/supabase/connect'

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
			console.log('hasOnboarded error: cant run check')
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
