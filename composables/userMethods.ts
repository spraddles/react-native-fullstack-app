import { supabase } from '@/supabase/connect'
import { cleanDataByKey } from '@/composables/inputFormatter'

export const updateUserMeta = async (id: string, data: object) => {
	try {
		// clean data first
		const cleanData = cleanDataByKey(data, ['passport', 'cpf'])
		// check if data exists
		const checkUser = await supabase.from('user_meta').select().eq('user_id', id).single()

		// no user data exists: create entry
		if (checkUser.data === null) {
			const insertCommand = await supabase
				.from('user_meta')
				.insert(cleanData)
				.eq('user_id', id)
				.select()
				.single()
			return { status: true }
		}

		// data exists: update it
		if (checkUser.data !== null) {
			const updateCommand = await supabase
				.from('user_meta')
				.update(cleanData)
				.eq('user_id', id)
				.select()
				.single()

			return { status: true }
		} else {
			console.log('updateUserMeta: error')
			return { status: false }
		}
	} catch (error) {
		console.error('Error updating the user:', error)
		return { status: false, error: error.message }
	}
}

export const fetchUserProfile = async () => {
	const supabaseUser = await supabase.auth.getUser()
	const supabaseUserID = supabaseUser?.data?.user?.id
	const userProfile = await supabase
		.from('user_meta')
		.select()
		.eq('user_id', supabaseUserID)
		.single()

	const object = {
		...userProfile?.data,
		email: supabaseUser?.data?.user?.email
	}
	return object
}

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