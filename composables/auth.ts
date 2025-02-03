import { useBaseStore } from '@/store/base'
import { supabase } from '@/supabase/connect'
import { router } from 'expo-router'

export const logout = async (message: string) => {
	try {
		await supabase.auth.signOut()

		useBaseStore.getState().resetUser()
		useBaseStore.getState().setTransactions([])
		useBaseStore.getState().setLoading(false)

		router.push('/(pages)')

		if (message) {
			useBaseStore.getState().setToast({
				visible: true,
				message: message
			})
		}
	} catch (error) {
		console.error('Logout error:', error)
	}
}
