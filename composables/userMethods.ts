import { supabase } from '@/supabase/connect'
import { stripFormat } from '@/composables/inputFormatter'
import countries from '@/assets/data/countries.json'
import { apiFetch } from '@/composables/api'

export const updateUserMeta = async (id: string, data: object) => {
	try {
		const cleanData = {
			country: data.country,
			cpf: !data.cpf ? null : stripFormat(data.cpf), // if CPF empty write NULL in db as CPF is an optional field
			dob_day: data.dob_day,
			dob_month: data.dob_month,
			dob_year: data.dob_year,
			has_onboarded: data.has_onboarded,
			name: data.name,
			passport: stripFormat(data.passport),
			phone: data.phone,
			surname: data.surname,
			user_id: data.user_id
		}

		const checkUser = await supabase.from('user_meta').select().eq('user_id', id).single()

		// no user data exists: create entry
		if (checkUser.data === null) {
			const insertCommand = await supabase
				.from('user_meta')
				.insert(cleanData)
				.eq('user_id', id)
				.select()
				.single()

			// error
			if (insertCommand.data === null && insertCommand.error.code) {
				console.log('insertCommand error: ', insertCommand.error)
				return { status: false, error: 'There is an error creating your profile' }
			}
			// success
			if (insertCommand.error === null) {
				return { status: true }
			}
		}

		// data exists: update it
		if (checkUser.data !== null) {
			const updateCommand = await supabase
				.from('user_meta')
				.update(cleanData)
				.eq('user_id', id)
				.select()
				.single()

			// error
			if (updateCommand.data === null && updateCommand.error.code) {
				console.log('updateCommand error: ', updateCommand.error)
				return { status: false, error: 'There is an error updating your profile' }
			}
			// success
			if (updateCommand.error === null) {
				return { status: true }
			}
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

export const getCountry = (code: string) => {
	if (!code) {
		return {}
	}
	return countries.find((c) => c.code === code.toUpperCase()) || null
}

export const serverAuth = async () => {
	try {
		const url = process.env.EXPO_PUBLIC_SERVER_URL + '/api/example'
		const apiFetchResponse = await apiFetch(url, {
			method: 'POST',
			body: JSON.stringify(data)
		})
		console.log('apiFetchResponse: ', apiFetchResponse)
	} catch (error) {
		console.log('error: ', error)
	}
}
