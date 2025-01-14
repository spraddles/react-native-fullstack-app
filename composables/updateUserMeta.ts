import { supabase } from '@/supabase/connect'

export const updateUserMeta = async (id: string, data: object) => {
	try {
		// check if data exists
		const checkUser = await supabase.from('user_meta').select().eq('user_id', id).single()

		// no user data exists: create entry
		if (checkUser.data === null) {
			const insertCommand = await supabase
				.from('user_meta')
				.insert(data)
				.eq('user_id', id)
				.select()
				.single()

			return { status: true }
		}

		// data exists: update it
		if (checkUser.data !== null) {
			const updateCommand = await supabase
				.from('user_meta')
				.update(data)
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
