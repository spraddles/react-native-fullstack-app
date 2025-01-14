import { supabase } from '@/supabase/connect'

export const updateUserMeta = async (email: string, data: object) => {
	try {
		const user = await supabase.rpc('get_user_by_email', {
			email_param: email
		})

		const userID = user.data[0].id

		const allData = {
			user_id: userID,
			...data
		}

		// check if data exists
		const checkUser = await supabase.from('user_meta').select().eq('user_id', userID).single()

		// no user data exists: create entry
		if (checkUser.data === null) {
			const insertCommand = await supabase
				.from('user_meta')
				.insert(allData)
				.eq('user_id', userID)
				.select()
				.single()

			return { status: true }
		}

		// data exists: update it
		if (checkUser.data !== null) {
			const updateCommand = await supabase
				.from('user_meta')
				.update(allData)
				.eq('user_id', userID)
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
